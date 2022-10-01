import React from 'react'
import Loading from '../loading'
import { cacheGetSync } from '@/cache'
import Redirect from '../redirect'
import { message } from 'antd'

type Iprops = {
  component: () => {
    default: React.FunctionComponent<Record<string, any>>
  }
  noTokenPages: string[]
  path: string
  redirect: string
} & Record<string, any>

type IState = {
  Comp: React.FunctionComponent<Record<string, any>> | null
}

export default class RenderComponent extends React.Component<Iprops, IState> {
  constructor(args: any) {
    super(args)
    this.state = {
      Comp: null,
    }
  }

  componentDidMount(): void {
    this.loadData()
  }

  async componentWillReceiveProps(nextProps: Iprops) {
    if (nextProps.component && this.props.path !== nextProps.path) {
      const res = await nextProps.component()
      this.setState({
        Comp: res.default,
      })
    }
  }

  async loadData() {
    const res = await this.props.component()
    this.setState({
      Comp: res.default,
    })
  }

  result(): JSX.Element {
    const { Comp } = this.state
    const { component, noTokenPages, redirect, ...oprops } = this.props
    if (Comp) {
      return <Comp {...oprops} />
    } else {
      return <Loading />
    }
  }

  render(): React.ReactNode {
    const { noTokenPages, redirect } = this.props

    if (noTokenPages.includes(this.props.path)) {
      return this.result()
    } else {
      const token = cacheGetSync('token')

      if (token) {
        return this.result()
      } else {
        return (
          <Redirect
            url={redirect}
            replace
            before={(call) => {
              message.info({
                content: '请重新登录',
                onClose: call,
                duration: 1.5,
              })
            }}
          >
            {this.result()}
          </Redirect>
        )
      }
    }
  }
}
