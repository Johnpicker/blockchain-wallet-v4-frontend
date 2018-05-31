import React, { Fragment } from 'react'
import styled from 'styled-components'
import { Text, Button, Icon, HeartbeatLoader, Link, Tooltip } from 'blockchain-info-components'
import { Remote } from 'blockchain-wallet-v4/src'
import FaqRow from 'components/Faq/FaqRow'
import CountdownTimer from 'components/Form/CountdownTimer'
import { Wrapper as ExchangeCheckoutWrapper } from '../../ExchangeCheckout'
import { flex, spacing } from 'services/StyleService'
import { reviewOrder } from 'services/SfoxService'
import { FormattedMessage } from 'react-intl'
import { OrderDetailsTable, OrderDetailsRow } from 'components/BuySell/OrderDetails'
import FundingSource from 'components/BuySell/FundingSource'
import { StepTransition } from 'components/Utilities/Stepper'

const StyledFaqRow = styled(FaqRow)`
  padding: 20px 0px;
  border-bottom: 1px solid ${props => props.theme['gray-1']};
`

const MethodContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  height: 42px;
  border: 1px solid ${props => props.theme['gray-2']}
`
const CancelWrapper = styled.div`
  a {
    color: #545456;
    font-weight: 300;
    font-size: 14px;
  }
`
const ToolTipWrapper = styled.div`
  display: flex;
  flex-direction: row;
  div:first-of-type {
    margin-right: 5px;
  }
`

export const OrderDetails = ({ quoteR, account, onRefreshQuote, type }) => (
  <ExchangeCheckoutWrapper>
    <Text size='32px' weight={600} style={spacing('mb-10')}>
      <FormattedMessage id='buy.sfoxcheckout.almostthere' defaultMessage="You're almost there" />
    </Text>
    <Text size='14px' weight={300} style={spacing('mb-20')}>
      <FormattedMessage id='buy.sfoxcheckout.revieworder.subtext' defaultMessage='Before we can start processing your order, review the order details below. If everything looks good to you, click submit to complete your order.' />
    </Text>
    <Text size='14px' weight={300} style={spacing('mt-20')}>
      <FormattedMessage id='buy.sfoxcheckout.connectedaccount' defaultMessage='Your Connected Account' />:
    </Text>
    <MethodContainer style={spacing('mt-10')}>
      <Icon style={spacing('ml-15')} name='bank-filled' size='26px' />
      <FundingSource account={account} />
    </MethodContainer>
    <div style={{ ...flex('row align/center justify/end'), ...spacing('mt-20') }}>
      <Text size='12px' weight={500} style={spacing('mr-10')}>
        <FormattedMessage id='buy.sfoxcheckout.exchangerate' defaultMessage='Exchange Rate' />
      </Text>
      <Text size='12px' weight={300}>
        1 BTC = {quoteR.map((quote) => `$${quote.rate}`).getOrElse('~')}
      </Text>
    </div>
    <OrderDetailsTable style={spacing('mt-10')}>
      <OrderDetailsRow>
        {
          type === 'buy'
            ? <Text size='13px' weight={300}><FormattedMessage id='orderdetails.amounttopurchase' defaultMessage='BTC Amount to Purchase' /></Text>
            : <Text size='13px' weight={300}><FormattedMessage id='orderdetails.amounttosell' defaultMessage='BTC Amount to Sell' /></Text>
        }
        <Text size='13px' weight={300}>{quoteR.map(quote => reviewOrder.renderFirstRow(quote, type)).getOrElse('~')}</Text>
      </OrderDetailsRow>
      <OrderDetailsRow>
        <ToolTipWrapper>
          <Text size='13px' weight={300}>
            <FormattedMessage id='orderdetails.tradingfee' defaultMessage='Trading Fee' />
          </Text>
          <Tooltip>
            <FormattedMessage id='orderdetails.tradingfee.tooltip' defaultMessage='The fee charged to execute a trade through SFOX.' />
          </Tooltip>
        </ToolTipWrapper>
        <Text size='13px' weight={300}>{quoteR.map(quote => `$${(+quote.feeAmount).toFixed(2)}`).getOrElse('~')}</Text>
      </OrderDetailsRow>
      <OrderDetailsRow>
        {
          type === 'buy'
            ? <Text size='13px' weight={300}><FormattedMessage id='orderdetails.totalcost' defaultMessage='Total Cost' /></Text>
            : <Text size='13px' weight={300}><FormattedMessage id='orderdetails.totaltobereceived' defaultMessage='Total to be Received' /></Text>
        }
        <Text size='13px' weight={300} color='success'>{quoteR.map(quote => reviewOrder.renderTotal(quote, type)).getOrElse('~')}</Text>
      </OrderDetailsRow>
    </OrderDetailsTable>
    {quoteR.map((quote) => (
      <CountdownTimer
        style={spacing('mt-20')}
        expiryDate={quote.expiresAt.getTime()}
        handleExpiry={onRefreshQuote}
        tooltipExpiryTime='30 seconds'
      />
    )).getOrElse(null)}
  </ExchangeCheckoutWrapper>
)

export const OrderSubmit = ({ quoteR, onSubmit, busy, clearTradeError }) => (
  <Fragment>
    {
      busy instanceof Error
        ? <div>
          <Text color='error' size='13px'>
            Sorry, something went wrong with your trade: { busy.message }
          </Text>
          <span onClick={() => clearTradeError()}><StepTransition prev Component={Link} weight={300} size='13px'><FormattedMessage id='try_again' defaultMessage='Try again' /></StepTransition></span>
        </div>
        : <Fragment>
          <Button
            nature='primary'
            disabled={!Remote.Success.is(quoteR)}
            onClick={quoteR.map((quote) => () => onSubmit(quote)).getOrElse(null)}>
            {
              busy
                ? <HeartbeatLoader height='20px' width='20px' color='white' />
                : <FormattedMessage id='buysell.sfoxcheckout.orderreview.submit' defaultMessage='Submit' />
            }
          </Button>
          <CancelWrapper style={{ ...flex('row justify/center'), ...spacing('mt-15') }}>
            <StepTransition prev Component={Link}>
              <FormattedMessage id='buysell.sfoxcheckout.orderreview.cancel' defaultMessage='Cancel' />
            </StepTransition>
          </CancelWrapper>
        </Fragment>
    }
    <StyledFaqRow
      title={<FormattedMessage id='scenes.buysell.sfoxcheckout.orderreview.helper1.question' defaultMessage='What are the fees?' />}
      description={<FormattedMessage id='scenes.buysell.sfoxcheckout.orderreview.helper1.answer' defaultMessage='There is a trading fee that SFOX requires to execute a buy or sell trade. For sell trades specifically, there is an additional transaction fee that goes to network miners in order to send the amount you’re selling to SFOX.' />}
    />
    <StyledFaqRow
      title={<FormattedMessage id='scenes.buysell.sfoxcheckout.orderreview.helper2.question' defaultMessage='How long will it take to get my funds?' />}
      description={<FormattedMessage id='scenes.buysell.sfoxcheckout.orderreview.helper2.answer' defaultMessage='On average, it will take about a week for you to receive your funds from either a buy or sell trade.' />}
    />
    <StyledFaqRow
      title={<FormattedMessage id='scenes.buysell.sfoxcheckout.orderreview.helper3.question' defaultMessage='Can I cancel my trade?' />}
      description={<FormattedMessage id='scenes.buysell.sfoxcheckout.orderreview.helper3.answer' defaultMessage='Once you submit your trade here, it will move into a pending state, and cannot be reversed, cancelled or changed. Please be sure to verify the information here carefully before submitting.' />}
    />
  </Fragment>
)
