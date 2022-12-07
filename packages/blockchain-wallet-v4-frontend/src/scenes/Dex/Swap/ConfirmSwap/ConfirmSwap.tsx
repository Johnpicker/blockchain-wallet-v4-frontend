import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@blockchain-com/constellation'

import { actions, model, selectors } from 'data'
import type { DexSwapForm } from 'data/types'
import { ModalName } from 'data/types'

import {
  BaseRateAndFees,
  FlipPairButton,
  FormWrapper,
  QuoteDetails,
  SwapPair,
  SwapPairWrapper
} from '../components'
import { Header } from './Header'

const { DEX_SWAP_FORM } = model.components.dex

type Props = {
  onClickBack: () => void
  walletCurrency: string
}

export const ConfirmSwap = ({ onClickBack, walletCurrency }: Props) => {
  const dispatch = useDispatch()

  const formValues = useSelector(selectors.form.getFormValues(DEX_SWAP_FORM)) as DexSwapForm
  const { baseToken, baseTokenAmount, counterToken, counterTokenAmount, slippage } =
    formValues || {}

  const baseTokenBalance = useSelector(
    selectors.components.dex.getDexCoinBalanceToDisplay(baseToken)
  )
  const counterTokenBalance = useSelector(
    selectors.components.dex.getDexCoinBalanceToDisplay(counterToken)
  )

  const onViewSettings = () => {
    dispatch(actions.modals.showModal(ModalName.DEX_SWAP_SETTINGS, { origin: 'Dex' }))
  }

  const onConfirmSwap = () => null

  return (
    <FormWrapper>
      <Header onClickBack={onClickBack} />

      <SwapPairWrapper>
        <SwapPair
          isQuoteLocked
          swapSide='BASE'
          balance={baseTokenBalance}
          coin={baseToken}
          amount={baseTokenAmount || 0}
          walletCurrency={walletCurrency}
        />

        <FlipPairButton isQuoteLocked />

        <SwapPair
          isQuoteLocked
          swapSide='COUNTER'
          balance={counterTokenBalance}
          coin={counterToken}
          amount={counterTokenAmount || 0}
          walletCurrency={walletCurrency}
        />
      </SwapPairWrapper>

      <BaseRateAndFees
        isQuoteLocked
        swapDetailsOpen
        walletCurrency={walletCurrency}
        handleDetailsToggle={() => null} // FIXME: Toggle details
      />

      <QuoteDetails
        swapDetailsOpen
        walletCurrency={walletCurrency}
        slippage={slippage}
        handleSettingsClick={onViewSettings}
      />

      <Button
        size='large'
        width='full'
        variant='primary'
        onClick={onConfirmSwap}
        text={<FormattedMessage id='copy.confirmSwap' defaultMessage='Confirm Swap' />}
      />
    </FormWrapper>
  )
}
