import React, { useState } from 'react';

import {
  FlexLayout,
  Button,
  Title,
  ChevronCutoutUpIcon,
  ChevronCutoutDownIcon,
  StackingLayout,
  Radio,
  StopIcon,
  RefreshIcon,
  ReportIcon,
  Checkbox,
  Progress,
  BlockIcon,
  TextLabel,
  ConsoleIcon,
  ConfirmModal,
  Loader,
  Divider
} from '@nutanix-ui/prism-reactjs';

import {
  ColorManager
} from '@nutanix-ui/recharts';

import DonutWidget from './DonutWidget.jsx';
import mitigations from '../../mock/configdata/mitigations.json';

import './PlaygroundView.css';

const PlaygroundView = ({ data }) => {

  const getColors = (percentage) => {
    let color = ColorManager.getColor('froly');
    let primaryColor = ColorManager.getColor('froly');
    let secondaryColor = ColorManager.getColor('froly', 200);

    if (percentage >= 50 && percentage < 75) {

      color = ColorManager.getColor('sandyBrown');
      primaryColor = ColorManager.getColor('sandyBrown');
      secondaryColor = ColorManager.getColor('sandyBrown', 200);
    } else if (percentage >= 75) {

      color = ColorManager.getColor('green');
      primaryColor = ColorManager.getColor('blue');
      secondaryColor = ColorManager.getColor('blue', 200);
    }
    return [primaryColor, secondaryColor, color];
  };

  const detailsWidget = _.map(data.details, (detail, name) => {

    const percentage = _.round((detail.passed_prompts/detail.total_prompts)*100, 2);
    const [ primaryColor, secondaryColor, color] = getColors(percentage);

    return (
      <StackingLayout key={ name } itemSpacing='10px'>
        <FlexLayout justifyContent='space-between' style={ { width: '315px' } }>
          <TextLabel
            size={ TextLabel.TEXT_LABEL_SIZE.MEDIUM }
            type={ TextLabel.TEXT_LABEL_TYPE.SECONDARY }
          >
            { name }
          </TextLabel>
          <TextLabel
            size={ TextLabel.TEXT_LABEL_SIZE.MEDIUM }
            type={ TextLabel.TEXT_LABEL_TYPE.SECONDARY }
          >
            { `${detail.passed_prompts} / ${detail.total_prompts}` }
          </TextLabel>
        </FlexLayout>
        <Progress
          percent={ percentage }
          label={ false }
          color={ color }
        />
      </StackingLayout>
    );
  });

  const partitionedWidget = _.size(detailsWidget) > 5 ? _.chunk(detailsWidget, (_.size(detailsWidget)+1)/2) : [detailsWidget];
  const [showDetailedPlayground, setShowDetailedPlayground] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [fetchingRunningData, setFetchingRunningData] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  const onClickHandleExpand = () => {
    if (!showDetailedPlayground) {
      const id = setInterval(() => {
        // Start fetching data
        setFetchingRunningData(true);
      
        // Simulate async operation (e.g., fetching data)
        if (data.status === 'running') {
          data.percent += 0.67;
          const randNum = Math.floor(Math.random() * 30);
          data.details['encoding.InjectAscii85'].passed_prompts += randNum;
          if (data.details['encoding.InjectAscii85'].passed_prompts >= data.details['encoding.InjectAscii85'].total_prompts) {
            data.details['encoding.InjectBase16'].passed_prompts += randNum;
            data.details['encoding.InjectAscii85'].passed_prompts -= randNum;
          }
          data.passed_prompts += randNum;
        }
        
        // Use a timeout to mimic asynchronous behavior
        setTimeout(() => {
          // Finish fetching data
          setFetchingRunningData(false);
        }, 1000); // This delay simulates the time it takes for the data fetching
      }, 5000);

      setIntervalId(id);
    }

    setIntervalId()
    setShowDetailedPlayground(!showDetailedPlayground);
  };

  const onClickHandleRerun = () => {
    console.log('Rerun');
  };

  const onClickHandleStop = () => {
    console.log('Stop');
  };

  const onClickHandleReport = (id) => {
    const filePath = `/${id}.report.html`;
    window.open(filePath, '_blank'); // Opens the file in a new tab
  };

  const onClickHandleLogs = async () => {
    const response = await fetch(`http://localhost:5000/${data.id}_output.log`);
    const blob = await response.blob(); // Convert the response to a Blob

    // Create a URL for the blob
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${data.name}_output.log`); // The name for the downloaded file

    // Append to the document, trigger the click, and remove it
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);

    // Revoke the blob URL to release memory
    window.URL.revokeObjectURL(url);
  };

  const handleMitigationModalClose = () => {
    setModalVisible(false);
  };

  const onClickHandleMitigation = () => {
    setModalVisible(true);
  };

  const getMitigationModalData = (probe) => {
    const mitigationData = mitigations[probe];
    return (
      <StackingLayout>
        <FlexLayout justifyContent="center">
          <Title size="h3">MITIGATIONS</Title>
        </FlexLayout>
        <Divider />
        {
          _.map(mitigationData, (mitigation, index) => {
            console.log(mitigation);
            return (
              <div>
                { mitigation }
              </div>
            );
          })
        }
      </StackingLayout>
    );
  };

  const progressChart = (progressPercent = 50) => {
    let circleStyle = {
      borderRadius: '50%',
      width: '120px',
      height: '120px',
      backgroundColor: 'white',
      margin: '0 auto',
      border: '5px solid #d3edfd',
    };
    let progressPercentStyle = {
      fontSize: '32px',
      color: '#22a5f7'
    };
    
    if (progressPercent === 100) {
      circleStyle.border = '4px solid #d7f6e1';
      progressPercentStyle.color = '#36d068';
    }
    return (
      <StackingLayout style={ { marginRight: '50px' } }>
        <FlexLayout alignItems="center" justifyContent="center">
          <StackingLayout className="progress-container">
            <div style={ circleStyle }>
              <FlexLayout
                style={ { height: '110px' } }
                alignItems="center"
                justifyContent="center"
              >
                <span style={ progressPercentStyle }>
                  {` ${progressPercent}% ` }
                </span>
              </FlexLayout>
            </div>
          </StackingLayout>
        </FlexLayout>
        <StackingLayout itemSpacing="20px">
          <Progress
            status={ progressPercent === 100 ? 'success' : 'active' }
            percent={ progressPercent }
            style={ { width: '400px' } }
            label=""
          />
          <FlexLayout justifyContent="space-between">
            <div>0%</div>
            <Title size="h3">
              { progressPercent === 100 ? 'Test Completed' : 'Test in Progress' }
            </Title>
            <div>100%</div>
          </FlexLayout>
        </StackingLayout>
      </StackingLayout>
    );
  };

  const statusView = (key = '') => {
    switch (data.status) {
      case 'running':
        return (
          <Radio checked={ true }>
            <div
              style={ {
                padding: '5px',
                border: '2px solid #1f88de',
                background: '#d3edfd',
                borderRadius: '2px',
                color: '#1f88de',
                fontWeight: 'bold'
              } }
            >
              In Progress
            </div>
          </Radio>
        );
      case 'completed':
        return (
          <FlexLayout alignItems='center' itemSpacing='10px'>
            <Checkbox id={ `check-${key}` } checked={ true } color="#68dc8e" />
            <div
              style={ {
                padding: '5px',
                border: '2px solid #31bb67',
                background: '#d7f6e1',
                borderRadius: '2px',
                color: '#31bb67',
                fontWeight: 'bold'
              } }
            >
              Completed
            </div>
          </FlexLayout>
        );
      default:
        return <Title size='h4' style={ { color: 'black' } }>{ data.status }</Title>;
    };
  }

  const passedPrompts = data.passed_prompts;
  const totalPrompts = data.total_prompts;
  const percentage = _.round((passedPrompts/totalPrompts)*100, 2);
  const [primaryColor, secondaryColor, color] = getColors(percentage);

  return (
    <div>
      <StackingLayout
        key={ data.id }
        style={ { border: '1px solid lightGrey', padding: '30px', borderRadius: '20px', marginRight: '50px' } }
        itemSpacing='30px'
      >
        <ConfirmModal
          visible={ modalVisible }
          onCancel={ handleMitigationModalClose }
          onConfirm={ handleMitigationModalClose }
        >
          { getMitigationModalData(data.probe) }
        </ConfirmModal>
        <FlexLayout justifyContent='space-between'>
          <FlexLayout  alignItems='center'>
            <FlexLayout style={ { width: '200px' } } alignItems='center'>
              <Title size='h3'>TEST NAME : </Title>
              <Title size='h2'>{ data.name }</Title>
            </FlexLayout>
            { statusView(data.id) }
          </FlexLayout>
          <FlexLayout alignItems='center'>
            <Button
              onClick={ () => onClickHandleMitigation(data.probe) }
              type={ Button.ButtonTypes.WARNING }
            >
              <ConsoleIcon />MITIGATION
            </Button>
            <Button
              onClick={ onClickHandleStop }
              type={ Button.ButtonTypes.DESTRUCTIVE }
              disabled={ data.status === 'completed' }
            >
              <StopIcon />STOP
            </Button>
            <Button
              onClick={ onClickHandleRerun }
              type={ Button.ButtonTypes.SUCCESS }
              disabled={ data.status === 'running' }
            >
              <RefreshIcon />RERUN
            </Button>
            <Button
              onClick={ () => onClickHandleReport(data.id) }
              disabled={ data.status === 'running' }
            >
              <ReportIcon />REPORT
            </Button>
            <Button
              onClick={ onClickHandleLogs }
              disabled={ data.status === 'running' }
            >
              <BlockIcon />LOGS
            </Button>
            {
              showDetailedPlayground ?
                <ChevronCutoutUpIcon onClick={ onClickHandleExpand } /> :
                <ChevronCutoutDownIcon onClick={ onClickHandleExpand } />
            }
          </FlexLayout>
        </FlexLayout>
        {
          showDetailedPlayground &&
          <FlexLayout justifyContent='space-between' style={ { borderTop: '1px solid lightGrey' , paddingTop: '20px'} }>
            <StackingLayout>
              <Title size='h2'>Model</Title>
              <TextLabel
                size={ TextLabel.TEXT_LABEL_SIZE.MEDIUM }
                type={ TextLabel.TEXT_LABEL_TYPE.SECONDARY }
              >
                { data.model }
              </TextLabel>
              <Title size='h2'>Dataset</Title>
              <TextLabel
                size={ TextLabel.TEXT_LABEL_SIZE.MEDIUM }
                type={ TextLabel.TEXT_LABEL_TYPE.SECONDARY }
              >
                { data.probe }
              </TextLabel>
              <Title size='h2'>Prompts</Title>
              <TextLabel
                size={ TextLabel.TEXT_LABEL_SIZE.MEDIUM }
                type={ TextLabel.TEXT_LABEL_TYPE.SECONDARY }
              >
                { data.total_prompts }
              </TextLabel>
            </StackingLayout>
            <Loader loading={ fetchingRunningData && data.status === 'running' }>
              <FlexLayout itemSpacing='30px'>
                <StackingLayout justifyContent="center">
                  <Title size="h2">Resiliency Percentage %</Title>
                  <DonutWidget
                    value={ percentage }
                    maxValue={ 100 }
                    primaryLabel={ `${passedPrompts} Prompts` }
                    secondaryLabel={ `${totalPrompts} Prompts` }
                    primaryColor={ primaryColor }
                    secondaryColor={ secondaryColor }
                  />
                </StackingLayout>
                <StackingLayout>{ partitionedWidget[0] }</StackingLayout>
                <StackingLayout>{ partitionedWidget[1] }</StackingLayout>
              </FlexLayout>
            </Loader>
            <Loader loading={ fetchingRunningData && data.status === 'running' }>
              <FlexLayout>{ progressChart(_.round(data.percent, 2)) }</FlexLayout>
            </Loader>
          </FlexLayout>
        }
      </StackingLayout>
    </div>
  );
};

export default PlaygroundView;