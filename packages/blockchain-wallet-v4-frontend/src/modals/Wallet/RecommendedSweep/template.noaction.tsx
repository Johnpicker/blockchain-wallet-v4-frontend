import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import { Button, Modal, ModalBody, ModalHeader, Text } from 'blockchain-info-components'
import { Analytics, ModalName } from 'data/types'

import { Props as OwnProps } from '.'

const NoActionRequired = (props: Props) => {
  const { position, total, walletGuid } = props

  useEffect(() => {
    props.analyticsActions.trackEvent({
      key: Analytics.NO_VULNERABLE_FUNDS_SHOWN,
      properties: {}
    })
  }, [])

  const thanksClicked = () => {
    props.modalActions.closeModal(ModalName.RECOMMENDED_IMPORTED_SWEEP)
    props.cacheActions.noActionRequiredSweep({ guid: walletGuid, seen: true })
  }

  return (
    <Modal size='large' position={position} total={total}>
      <ModalHeader closeButton={false}>
        <FormattedMessage id='modals.securitynotice.title' defaultMessage='Security Notice' />
      </ModalHeader>

      <ModalBody>
        <Text size='16px' weight={400} lineHeight='1.5' style={{ marginBottom: '16px' }}>
          <FormattedMessage
            id='modals.uptodate.body'
            defaultMessage='Your wallet does not contain any funds affected by the identified security issue. You can continue using your wallet normally.'
          />
        </Text>
        <Button data-e2e='upToDateThanks' nature='primary' fullwidth onClick={thanksClicked}>
          <FormattedMessage id='modals.uptodate.thanks' defaultMessage='Thanks!' />
        </Button>
      </ModalBody>
    </Modal>
  )
}

type Props = {
  position: number
  total: number
} & OwnProps

export default NoActionRequired
