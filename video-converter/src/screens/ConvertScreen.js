import React, { Component } from 'react';
import { connect } from 'react-redux';
import VideoList from '../components/VideoList';
import ConvertPanel from '../components/ConvertPanel';
import VideoSelectScreen from './VideoSelectScreen';
import { setFormat, removeVideo, showInFolder, setOrientation } from '../actions';

class ConvertScreen extends Component {
  render() {
    return (
      <div className="container">
        <VideoSelectScreen small />
        <VideoList
          videos={this.props.videos}
          onOrientationChange={this.props.setOrientation}
          onFormatChange={this.props.setFormat}
          onFolderOpen={this.props.showInFolder}
          removeVideo={this.props.removeVideo}

        />
        <ConvertPanel />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { videos: state.videos };
}

export default connect(mapStateToProps, { setFormat, setOrientation, removeVideo, showInFolder })(ConvertScreen);
