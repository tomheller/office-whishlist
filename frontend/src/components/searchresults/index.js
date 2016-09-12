import React, {Component} from 'react';
import Track from '../track';

class Searchresults extends Component {

  constructor(props) {
    super(props);
    this.state = this.initialState = {
      results: [],
    };
  }

  render() {
    return (
      <div className="searchresults">
        {this.props.results.map((scope, index) => {
          if(!scope.tracks) return null;
          return scope.tracks.slice(0, 10).map((track, index) => {
            return (
              <Track
                trackdata={track}
                onTrackAdded={this.props.onTrackAdded}
                addable = {true}
                />
            )
          } || '')
        })}
      </div>
    )
  }
}

Searchresults.propTypes = {
  onTrackAdded: React.PropTypes.func,
  onTrackVotedUp: React.PropTypes.func,
  onTrackVotedDown: React.PropTypes.func,
};

export default Searchresults;
