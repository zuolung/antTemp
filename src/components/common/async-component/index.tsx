import React from 'react'
import Loading from '../loading'

type Iprops = {
  component: () => {
    default: React.FunctionComponent
  }
}

type IState = {
  Com: React.FunctionComponent | null
}

export default class RenderComponent extends React.Component<Iprops, IState> {
  constructor(args: any) {
    super(args)
    this.state = {
      Com: null,
    }
  }

  async componentDidMount() {
    if (this.props.component) {
      const res = await this.props.component()
      this.setState({
        Com: res.default,
      })
    }
  }

  render(): React.ReactNode {
    const { Com } = this.state
    const props: any = this.props
    if (Com) {
      return <Com {...props} />
    } else {
      return <Loading />
    }
  }
}
