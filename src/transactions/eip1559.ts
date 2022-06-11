import { Provider, TransactionRequest } from '@ethersproject/abstract-provider'
import { FlashbotsBundleProvider } from '@flashbots/ethers-provider-bundle'
import { BigNumber } from 'ethers'
import JSBI from 'jsbi'
import pino from 'pino'

const logger = pino()

export const createEIP1559Transaction = async (
  blockNumber: number,
  to: string,
  data: string,
  blocksInFuture: number,
  chainId: number,
  tipToMiner: JSBI,
  provider: Provider
): Promise<TransactionRequest> => {
  const block = await provider.getBlock(blockNumber)
  if (!block.baseFeePerGas) throw new Error('Chain does not support EIP1559, write code for legacy')
  const maxBaseFeeInFutureBlock = FlashbotsBundleProvider.getMaxBaseFeeInFutureBlock(
    block.baseFeePerGas,
    blocksInFuture
  )
  const transaction = {
    to,
    type: 2,
    data: data ?? '0x',
    gasLimit: 1000000,
    chainId
  }
  const totalGas = await provider.estimateGas(transaction)
  const minerTip = BigNumber.from(tipToMiner.toString()).div(totalGas)
  logger.info(`Will tip miner with ${tipToMiner.toString()} wei through gas price manipulation`)
  logger.info(
    'gasEstimate: ' +
      totalGas.toString() +
      ' | baseFeePerGas: ' +
      maxBaseFeeInFutureBlock.toString() +
      ' | maxFeePerGas ' +
      maxBaseFeeInFutureBlock.add(minerTip).toString()
  )
  return {
    ...transaction,
    maxFeePerGas: maxBaseFeeInFutureBlock.add(minerTip),
    maxPriorityFeePerGas: maxBaseFeeInFutureBlock.add(minerTip)
  }
}
