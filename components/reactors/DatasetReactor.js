import React from 'react';
import DatasetStore from '../../stores/DatasetStore';
import {connectToStores} from 'fluxible-addons-react';
import {enableAuthentication} from '../../configs/general';
import getResourcesCount from '../../actions/getResourcesCount';
import Dataset from '../dataset/Dataset';
import cloneResource from '../../actions/cloneResource';

class DatasetReactor extends React.Component {
    componentDidMount() {
        this.context.executeAction(getResourcesCount, {id: this.props.DatasetStore.dataset.datasetURI});
    }
    handleCloneResource(datasetURI, resourceURI) {
        this.context.executeAction(cloneResource, {
            dataset: datasetURI,
            resourceURI: resourceURI
        });
    }
    //removes properties from an object
    configMinus(config, props) {
        let o = {};
        for(let p in config) {
            if(props.indexOf(p) === -1){
                o [p] = config [p];
            }
        }
        return o;
    }
    render() {
        let datasetURI = this.props.DatasetStore.dataset.datasetURI;
        let resources = this.props.DatasetStore.dataset.resources;
        let page = this.props.DatasetStore.dataset.page;
        let total = this.props.DatasetStore.dataset.total;
        let isComplete = this.props.DatasetStore.isComplete;
        let config = this.props.DatasetStore.dataset.config;
        let datasetReactor;
        if(config && config.datasetReactor){
            switch(config.datasetReactor[0]){
                case 'Dataset':
                    datasetReactor = <Dataset enableAuthentication={enableAuthentication} datasetURI={datasetURI} resources={resources} page={page} total={total} config={this.configMinus(config, ['datasetReactor'])} onCloneResource={this.handleCloneResource.bind(this)} />;
                break;
                default:
                    datasetReactor = <Dataset enableAuthentication={enableAuthentication} datasetURI={datasetURI} resources={resources} page={page} total={total} config={this.configMinus(config, ['datasetReactor'])} onCloneResource={this.handleCloneResource.bind(this)}/>;
            }
        }

        return (
            <div ref="datasetReactor">
                {datasetReactor}
            </div>
        );
    }
}
DatasetReactor.contextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    getUser: React.PropTypes.func
};
DatasetReactor = connectToStores(DatasetReactor, [DatasetStore], function (context, props) {
    return {
        DatasetStore: context.getStore(DatasetStore).getState()
    };
});
export default DatasetReactor;
