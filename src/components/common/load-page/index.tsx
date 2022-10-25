import { Component } from 'react'
import { message } from 'antd'
import { cacheGetSync } from '@/cache'
import Loading from '../loading'
import Redirect from '../redirect'

type Iprops = {
  component: () => {
    default: React.FunctionComponent<Record<string, any>>
  }
  noTokenPages: string[]
  path: string
  redirect: string
  title: string
} & Record<string, any>

type IState = {
  Comp: React.FunctionComponent<Record<string, any>> | null
  originTitle?: string
}

export default class RenderComponent extends Component<Iprops, IState> {
  constructor(args: any) {
    super(args)
    this.state = {
      Comp: null,
      originTitle: '',
    }
  }

  UNSAFE_componentWillMount(): void {
    this.setState({
      originTitle: document.title,
    })
  }

  componentDidMount(): void {
    this.loadData()
  }

  async UNSAFE_componentWillReceiveProps(nextProps: Iprops) {
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
    const { Comp, originTitle } = this.state
    const { component, noTokenPages, redirect, ...oprops } = this.props
    if (Comp) {
      document.title = originTitle || '-'
      return <Comp {...oprops} />
    } else {
      document.title = '加载中...'
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
