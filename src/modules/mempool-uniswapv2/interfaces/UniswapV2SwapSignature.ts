export enum UniswapV2SwapSignature {
  swapTokensForExactTokens = '8803dbee',
  swapTokensForExactETH = '4a25d94a',
  swapETHForExactTokens = 'fb3bdb41',
  swapExactETHForTokens = '7ff36ab5',
  swapExactTokensForTokens = '38ed1739',
  swapExactTokensForETH = '18cbafe5',
  swapExactTokensForETHSupportingFeeOnTransferTokens = '791ac947',
  swapExactETHForTokensSupportingFeeOnTransferTokens = 'b6f9de95',
  swapExactTokensForTokensSupportingFeeOnTransferTokens = '5c11d795'
}

export const UNISWAP_V2_SWAP_SIGNATURES = Object.values(UniswapV2SwapSignature)

export const isUniswapV2SwapSignature = (signature: string) =>
  UNISWAP_V2_SWAP_SIGNATURES.includes(signature as UniswapV2SwapSignature)
