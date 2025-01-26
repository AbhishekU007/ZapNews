import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'


export class News extends Component {

  static defaultProps = {
    country: 'us',
    pageSize: 9,
    category: 'general'
  }
  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  }

  capitalizeFirstLetter = (string)=> {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

    constructor(props){
        super(props);
        this.state = {
            articles: [],
            loading: false,
            page: 1
        }
        document.title = `${this.capitalizeFirstLetter(this.props.category)} - ZapNews`;
    }

    async updateNews(){
      this.props.setProgress(10);
      const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
      this.setState({loading: true});
      let data = await fetch(url);
      this.props.setProgress(30);
      let parsedData = await data.json();
      this.props.setProgress(60);
      this.setState({
        totalResults: parsedData.totalResults,
        articles: parsedData.articles,
        loading: false
      })
      this.props.setProgress(100);
    }

    async componentDidMount(){
        this.updateNews();
    }

    handlePrevClick=async ()=>{
      await this.setState({page: this.state.page - 1})
      await this.updateNews();
    }

    handleNextClick=async ()=>{
    await this.setState({page: this.state.page + 1})
    await this.updateNews();
  }

  render() {
    return (
      <div className='container my-3'>
        <h1 className="text-center">Top Headlines - {this.capitalizeFirstLetter(this.props.category)}</h1>
        {this.state.loading && <Spinner/>}
        
        <div className="row">
        {!this.state.loading && this.state.articles.map((element)=>{
            return <div className="col-md-4" key={element.url}> 
                <NewsItem title={element.title ? element.title.slice(0,45) : ""} description={element.description ? element.description.slice(0,88) : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name}/>
                </div>
        })}
            
        </div>
        <div className="container d-flex justify-content-between">
          <button disabled={this.state.page<=1} type="button" className="btn btn-dark" onClick={this.handlePrevClick}>&larr; Previous</button>
          <button disabled={this.state.page > Math.ceil(this.state.totalResults/this.props.pageSize)} type="button" className="btn btn-dark" onClick={this.handleNextClick}>Next &rarr;</button>
        </div>
      </div>
    )
  }
}

export default News
