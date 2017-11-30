import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { getListData } from '../../../fetch/home/home.js'
import ListComponent from '../../../components/List'
import LoadMore from '../../../components/LoadMore'

import './style.less'

class List extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            data: [], //存储列表信息
            hasMore: false, //记录当前状态下还有没有更多的信息
            isLoadingMore: false, //记录当前状态下，是加载中还是点击加载更多
            page: 1 //下一页的页码
        }
    }

    componentDidMount() {
        //获取列表数据
        this.loadFirstPageData();
    }

    //获取第一页数据
    loadFirstPageData() {
        const cityName = this.props.cityName;
        const result = getListData(cityName, 0);
        this.resultHandle(result)
    }

    //加载更多数据
    loadMoreData() {
        //记录状态
        this.setState({
            isLoadingMore: true
        })
        const cityName = this.props.cityName;
        const page = this.state.page;
        const result = getListData(cityName, page);
        this.resultHandle(result);

        //增加page的计数
        this.setState({
            page: page + 1,
            isLoadingMore: false
        })
    }

    //数据处理
    resultHandle(result) {
        result.then(res => {
            return res.json()
        }).then(json => {
            const hasMore = json.hasMore;
            const data = json.data;
            this.setState({
                hasMore: hasMore,
                data: this.state.data.concat(data)
            })
        }).catch(er => {
            if(__DEV__){
                console.log('首页“猜你喜欢”获取数据报错, ', er.message)
            }
        })
    }

    render() {
        return (
            <div>
                <h2 className="home-list-title">猜你喜欢</h2>
                {
                    this.state.data.length
                    ? <ListComponent data={this.state.data}/>
                    : <div>加载中...</div>
                }
                {
                    this.state.hasMore
                    ? <LoadMore isLoadingMore={this.state.isLoadingMore} loadMoreFn={this.loadMoreData.bind(this)}/>
                    : ''
                }
            </div>
        )
    }
}

export default List