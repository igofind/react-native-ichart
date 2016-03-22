'use strict';

import React from 'react-native';
import ichart from './lib/ichart-wrapper.js';

const {
  View,
  WebView,
  } = React;

export default React.createClass({
  propTypes: {
    chart_type: React.PropTypes.string.isRequired,
    data: React.PropTypes.array.isRequired,
    title: React.PropTypes.string.isRequired,
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    coordinate: React.PropTypes.object.isRequired,
    labels: React.PropTypes.array.isRequired
  },
  /**
   * Create a Javascript static string to be injected to HTML.
   * @returns {*}
   */
  renderChart: function () {
    return `
      var chart = new iChart.${this.props.chart_type}({
        render: 'canvas-container',
        data: ${JSON.stringify(this.props.data)},
        title: '${this.props.title}',
        width: ${this.props.width},
        height: ${this.props.height},
        coordinate: ${JSON.stringify(this.props.coordinate)},
        labels: ${JSON.stringify(this.props.labels)}
      });
      chart.draw();
      `;
  },
  render: function () {
    let renderString = this.renderChart();
    return (
      <View>
        <WebView
          source={{html: this.createHTML(renderString)}}
          style={this.props.style}
          automaticallyAdjustContentInsets={false}
          contentInset={{top: 0, right: 0, bottom: 0, left: 0}}
          />
      </View>
    );
  },
  createHTML: function (renderJS) {
    var html = `
            <DOCTYPE html>
            <html>

                <head>
                    <title>iChart</title>
                    <meta charset="utf-8"/>
                    <meta name="viewport" content="initial-scale=1, width=device-width, user-scalable=no">
                    <style>
                        body{margin:0;padding:0;}
                        #canvas-container{width:100%;height:100%;};
                    </style>
                    <script>
                        window.onerror=function (){
                            alert(JSON.stringify(arguments));
                        };
                        ${ichart}
                    </script>
                </head>
                <body>
                    <div id="canvas-container"></div>
                    <script>
                        $(function(){
                          ${renderJS}
                        });
                    </script>
                </body>
            </html>
        `;
    return html;
  }
});



