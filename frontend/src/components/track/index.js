import React, {Component} from 'react';

class Track extends Component {

  constructor(props) {
    super(props);
    this.addable = this.props.addable;
  }

  voteUp(e) {
    if(this.props.onTrackVotedUp) {
      this.props.onTrackVotedUp(this.props.trackdata);
    }
  }

  voteDown(e) {
    if(this.props.onTrackVotedUp) {
      this.props.onTrackVotedDown(this.props.trackdata);
    }
  }

  addTrack(e) {
    if(this.props.onTrackAdded) {
      this.props.onTrackAdded(this.props.trackdata);
    }
  }

  componentWillUpdate() {
    let votingdata = {};
    this.downvotes = undefined;
    this.upvotes = undefined;
    if(this.props.trackdata.votingdata) {
      this.downvotes = this.props.trackdata.votingdata.down.length;
      this.upvotes = this.props.trackdata.votingdata.up.length;
    }
  }

  render() {
    let actiongroup;
    if(this.addable) {
      actiongroup = <div className="btngroup">
        <button className="btn btn--addtrack" onClick={this.addTrack.bind(this)}> <span>+</span> </button>
      </div>;
    } else {
      actiongroup = <div className="btngroup">
        <button className="btn btn--vote btn--votedown" onClick={this.voteDown.bind(this)}>{this.downvotes}</button>
        <button className="btn btn--vote btn--voteup" onClick={this.voteUp.bind(this)}>{this.upvotes} </button>
      </div>;
    }

    return (
      <div className="track">
        <p className="track__title">
          {this.props.trackdata.name}
        </p>
        <p className="track__artist">
        {this.props.trackdata.artists[0].name}
        </p>
        <div className="actiongroup">
          {actiongroup}
        </div>
      </div>
    )
  }
}


Track.propTypes = {
  onTrackAdded: React.PropTypes.func,
  onTrackVotedUp: React.PropTypes.func,
  onTrackVotedDown: React.PropTypes.func,
};

export default Track;
