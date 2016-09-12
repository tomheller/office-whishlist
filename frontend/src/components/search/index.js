import React, {Component} from 'react';


class Search extends Component {

  constructor(props) {
    super(props);
    this.state = this.initialState = {
      search: '',
      value: ''
    };
  }

  search() {
    if(this.props.onSearch) {
      this.props.onSearch(this.state.value);
    }
  }

  onChange(e) {
    clearTimeout(this.timer);
    const input = e.target.value;
    if (!input) return this.setState(this.initialState);
    this.setState({ value: input });
    this.timer = setTimeout(() => this.search(), 300);
  }

  render() {
    return (
      <div className="searchinputwrapper">
        <input
          type="search"
          value={this.state.value}
          onChange={this.onChange.bind(this)}
          className="searchinput"
        />
        <label className="label">Type your artist search here..</label>
      </div>
    );
  }
}

Search.propTypes = {
  onSearch: React.PropTypes.func,
};

export default Search;
