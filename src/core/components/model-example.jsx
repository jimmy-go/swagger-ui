import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"

export default class ModelExample extends React.Component {
  static propTypes = {
    getComponent: PropTypes.func.isRequired,
    specSelectors: PropTypes.object.isRequired,
    schema: PropTypes.object.isRequired,
    example: PropTypes.any.isRequired,
    isExecute: PropTypes.bool,
    getConfigs: PropTypes.func.isRequired,
    specPath: ImPropTypes.list.isRequired,
  }

  constructor(props, context) {
    super(props, context)
    let { getConfigs } = this.props
    let { defaultModelRendering } = getConfigs()
    if (defaultModelRendering !== "example" && defaultModelRendering !== "model") {
      defaultModelRendering = "example"
    }
    this.state = {
      activeTab: defaultModelRendering
    }
  }

  activeTab =( e ) => {
    let { target : { dataset : { name } } } = e

    this.setState({
      activeTab: name
    })
  }

cleanJsonExample = (example) => {
    let sample = example;
    if (typeof sample.props['param'] !== 'undefined'
        && typeof sample.props.param['_list'] !== 'undefined'
        && typeof sample.props.param._list['_tail'] !== 'undefined'
        && typeof 'array' in sample.props.param._list._tail['array'] !== 'undefined'
        && sample.props.param._list._tail.array.length > 4
    ) {
        let s = sample.props.param._list._tail.array[4][1]
        if (typeof s !== 'string') {
            return sample;
        }
        s = s.replace(/\\n/g, '')
        s = s.replace(/\\r/g, '')
        s = s.replace(/\\t/g, '')
        s = s.replace(/\\/g, '')
        s = s.replace(/\ /g, '')
        s = s.replace('"{', '{')
        s = s.replace('}"', '}')
        let obj = JSON.parse(s)
        sample.props.param._list._tail.array[4][1] = JSON.stringify(obj, null, 4)
    }
    return sample
}

  render() {
    let { getComponent, specSelectors, schema, example, isExecute, getConfigs, specPath } = this.props
    let { defaultModelExpandDepth } = getConfigs()
    const ModelWrapper = getComponent("ModelWrapper")

    let fixed = this.cleanJsonExample(example)

    return <div>
      <ul className="tab">
        <li className={ "tabitem" + ( isExecute || this.state.activeTab === "example" ? " active" : "") }>
          <a className="tablinks" data-name="example" onClick={ this.activeTab }>Example Value</a>
        </li>
        { schema ? <li className={ "tabitem" + ( !isExecute && this.state.activeTab === "model" ? " active" : "") }>
          <a className={ "tablinks" + ( isExecute ? " inactive" : "" )} data-name="model" onClick={ this.activeTab }>Model</a>
        </li> : null }
      </ul>
      <div>
        {
          (isExecute || this.state.activeTab === "example") && fixed
        }
        {
          !isExecute && this.state.activeTab === "model" && <ModelWrapper schema={ schema }
                                                     getComponent={ getComponent }
                                                     getConfigs={ getConfigs }
                                                     specSelectors={ specSelectors }
                                                     expandDepth={ defaultModelExpandDepth }
                                                     specPath={specPath} />


        }
      </div>
    </div>
  }

}
