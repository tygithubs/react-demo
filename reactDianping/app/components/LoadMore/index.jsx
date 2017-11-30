import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

import './style.less'

class LoadMore extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    render() {
        return (
            <div className="load-more" ref="wrapper">
                {
                    this.props.isLoadingMore
                    ? <span>加载中...</span>
                    : <span onClick={this.loadMoreHandle.bind(this)}>加载更多</span>
                }
            </div>
        )
    }

    componentDidMount() {
        //下拉加载
        let timeoutId;
        const wrapper = this.refs.wrapper;
        const loadMoreFn = this.props.loadMoreFn;
        function callback() {
            const top = wrapper.getBoundingClientRect().top;
            const windowHeight = window.screen.height;
            if(top && top < windowHeight) {
                loadMoreFn();
            }
        }
        window.addEventListener('scroll', function(){
            if(this.props.isLoadingMore) {
                return
            }
            if(timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(callback, 100);
        }.bind(this), false)
    }

    loadMoreHandle() {
        //执行传递过来的loadMoreData函数
        this.props.loadMoreFn();
    }
}

export default LoadMore