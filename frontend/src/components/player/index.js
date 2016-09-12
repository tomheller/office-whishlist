import React, {Component} from 'react';
import Track from '../track';

class Player extends Component {

  constructor(props) {
    super(props);

    this.requestUpdate();
    this.state = {
      volume: 100
    };

    this._currenttracklength = 0;
    this._currenttrackprogress = 0;
  }


  requestUpdate() {
    if(this.props.updatePlaystate) {
      this.props.updatePlaystate();
      setTimeout(() => this.requestUpdate(), 1000);
    }
  }

  playpause (e) {

    if(this.props.onPlayPause) {
      this.props.onPlayPause();
      this.props.state.playstate = 'paused';
    }
  }

  onVolumeChange (e, val) {
    const newValue = e.target.value;
    this.setState({
      volume: newValue,
    });
    if(this.props.onVolumeChange) {
      this.props.onVolumeChange(newValue);
    }
  }

  componentWillUpdate() {
    if(this.props.state.track) {
      this._currenttracklength = this.props.state.track.length || this._currenttracklength;
      this._currenttrackprogress = this.props.state.time || this._currenttrackprogress;
    }
  }

  render() {
    let playbuttonclass = 'btn btn--player';
    if(this.props.state) {
      playbuttonclass = (this.props.state.playstate === 'playing') ? 'btn btn--player btn--playerpause' : 'btn btn--player btn--playerplay';
    }
    let track = '';
    if(this.props.state.track) {
      track = <Track trackdata={this.props.state.track} />;
    }
    return (
      <div className="player">
        <button className={playbuttonclass} onClick={this.playpause.bind(this)}>{playbuttonclass}</button>
        <input type="range"
          min={0}
          max={100}
          value={this.state.volume}
          onChange={this.onVolumeChange.bind(this)}
          className="player__volume"
         />
        <progress
          max={this._currenttracklength}
          value={this._currenttrackprogress}
          className="player__progress"
          />
        {track}
      </div>
    );
  }
}

Player.propTypes = {
  onPlayPause: React.PropTypes.func,
  updatePlaystate: React.PropTypes.func,
  onVolumeChange: React.PropTypes.func,
};

export default Player;
