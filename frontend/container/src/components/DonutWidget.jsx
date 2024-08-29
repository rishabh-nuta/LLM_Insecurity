import React from 'react';
import {
  FlexLayout,
  StackingLayout,
  TextLabel,
  Title,
} from '@nutanix-ui/prism-reactjs';

import {
  Cell,
  Donut,
  DonutChart,
  DonutSector
} from '@nutanix-ui/recharts';

import {
  SampleWidget
} from '@nutanix-ui/recharts/styleguide/demo';

const donutHitBoxPadding = 5;
const donutThickness = 8;
const donutSize = 100;

class DonutWidget extends React.Component {

  renderBodyContent() {
    return (
      <StackingLayout itemSpacing="40px" itemDisplay="flex" style={ { flexGrow: 1 } }>
        <FlexLayout alignItems="center" itemSpacing="20px">
          { this.renderDonutChartContainer() }
          <FlexLayout itemSpacing="10px" flexDirection="column">
            <Title size="h2">
              { this.props.primaryLabel }
            </Title>
            <TextLabel type={ TextLabel.TEXT_LABEL_TYPE.SECONDARY }>
              { this.props.secondaryLabel }
            </TextLabel>
          </FlexLayout>
        </FlexLayout>
      </StackingLayout>
    );
  }

  renderDonutChart() {
    const startAngle = 90;
    const endAngle = -360 + startAngle;
    const size = donutSize + (donutHitBoxPadding * 2);

    const data = [
      {
        key: 'v',
        name: 'Video',
        value: this.props.value
      },
      // All data used minus storage capacity
      {
        key: 'f',
        name: 'Free',
        value: this.props.maxValue - this.props.value
      }
    ];

    return (
      <DonutChart width={ size } height={ size }>
        <Donut
          shape={ (props) => {
            let type = 'tinyHitBox';
            if (props.key === 'f') {
              type = 'tinyUnused';
            }

            return <DonutSector { ...props } type={ type } />;
          } }
          data={ data }
          innerRadius={ (donutSize / 2) - donutThickness }
          outerRadius={ donutSize / 2 }
          dataKey="value"
          onMouseEnter={ this.onPieEnter }
          onMouseLeave={ this.onPieLeave }
          paddingAngle={ 0 }
          startAngle={ startAngle }
          endAngle={ endAngle }
        >
          {
            data.map((entry, index) => {
              const { key } = entry;
              return (
                <Cell
                  key={ key }
                  secondaryFill={ this.props.secondaryColor }
                  fill={ this.props.primaryColor }
                />
              );
            })
          }
        </Donut>
      </DonutChart>
    );
  }

  renderDonutChartContainer() {
    const size = `${donutSize}px`;
    const padding = `-${donutHitBoxPadding}px`;
    return (
      <div style={ {
        position: 'relative',
        width: size,
        height: size
      } }>
        { this.renderActiveLabel() }
        <div style={ {
          position: 'absolute',
          top: padding,
          left: padding,
          bottom: 0,
          right: 0
        } }>
          { this.renderDonutChart() }
        </div>
      </div>
    );
  }

  renderActiveLabel() {
    return (
      <FlexLayout
        alignItems="center"
        justifyContent="center"
        style={ {
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0
        } }>
        <FlexLayout itemSpacing="10px" alignItems="center" flexDirection="column">
          <TextLabel
            size={ TextLabel.TEXT_LABEL_SIZE.MEDIUM }
            type={ TextLabel.TEXT_LABEL_TYPE.SECONDARY }
          >
            { `${this.props.value}%` }
          </TextLabel>
        </FlexLayout>
      </FlexLayout>
    );
  }

  render() {
    const { title } = this.props;
    let header = false;
    if (title) {
      header = title;
    }

    return (
      <SampleWidget
        title={ header }
        body={ this.renderBodyContent() }
        border={ false }
        showMetricOptions={ false }
        style={ { width: '400' } }
      />
    );
  }
}

export default DonutWidget;