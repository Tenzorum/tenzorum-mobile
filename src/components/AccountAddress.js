// Copyright 2015-2017 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// Parity is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Parity is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Parity.  If not, see <http://www.gnu.org/licenses/>.

'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Text } from 'react-native'
import AppStyles from '../styles'

export default class AccountAddress extends Component {
  static propTypes = {
    address: PropTypes.string
  }

  render () {
    return (
      <Text selectable style={AppStyles.valueText}>{this.props.address ? '0x' + this.props.address : 'Unknown'}</Text>
    )
  }
}
