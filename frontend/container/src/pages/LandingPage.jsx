import React, { useState } from 'react';
import _ from 'lodash';

import {
  FlexLayout,
  PlusIcon,
  StackingLayout,
  Button,
  Title,
  CloseIcon,
  RunIcon,
  Paragraph,
  CheckMarkIcon,
  Input,
  TextArea,
  Divider,
  UploadIcon,
  TextLabel,
  Slider,
  BatchIcon,
  Loader
} from '@nutanix-ui/prism-reactjs';

import {
  sleep
} from '../utils/AppUtils';

import PlaygroundView from '../components/PlaygroundView';
import mockedList from '../../mock/configdata/probes.json';
import './LandingPage.css';


const LandingPage = ({ history }) => {

  const configsData = [
    {
      id: 'rest_api',
      title: 'Rest API',
      need: 'Requires API specifications',
      selected: false
    },
    {
      id: 'open_api',
      title: 'Open API',
      need: 'Requires API Key',
      selected: false
    },
    {
      id: 'hugging_api',
      title: 'Hugging Face API',
      need: 'Requires API Key',
      selected: false
    }
  ];

  const dataSets = [
    {
      id: 'prompt_probe',
      name: 'Prompt Injection',
      description: 'Default dataset',
      selected: false,
      prompts: 3000,
      section: ['rest_api'],
    },
    {
      id: 'hallucination_probe',
      name: 'Package Hallucination',
      description: 'Default dataset',
      selected: false,
      prompts: 910,
      section: ['rest_api'],
    },
    {
      id: 'dan_probe',
      name: 'DAN',
      description: 'Default dataset',
      selected: false,
      prompts: 1340,
      section: ['rest_api'],
    },
    {
      id: 'xss_probe',
      name: 'XSS',
      description: 'Default dataset',
      selected: false,
      prompts: 240,
      section: ['rest_api'],
    },
    {
      id: 'encoding_probe',
      name: 'Encoding',
      description: 'Default dataset',
      selected: false,
      prompts: 6230,
      section: ['rest_api'],
    },
    {
      id: 'custom_probe',
      name: 'Custom',
      description: 'Local dataset',
      selected: false,
      section: ['rest_api', 'open_api', 'hugging_api'],
      upload: true
    }
  ];

  const playgroundJson = {
    "rest": {
      "RestGenerator": {
        "name": "Test",
        "uri": "http://10.47.21.52:8000/v1/try",
        "method": "post",
        "headers": {
          "Content-Type": "application/json"
        },
        "req_template_json_object": {
          "message": "$INPUT"
        },
        "response_json": true,
        "response_json_field": "data"
      }
    }
  };

  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [configs, setConfigs] = useState(configsData);
  const [datasets, setDataset] = useState(dataSets);
  const [isConfigSelected, setIsConfigSelected] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState('');
  const [playgroundData, setPlaygroundData] = useState(JSON.stringify(playgroundJson, null, 2));
  const [mockedData, setMockedData] = useState(_.slice(mockedList, 1));
  const [showLoader, setShowLoader] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState('');
  const [modelName, setModelName] = useState('');
  const [testName, setTestName] = useState('');
  const [apiToken, setAPIToken] = useState('');
  // const [tokens, setTokens] = useState(0);

  const onClickHandleAddTest = () => {
    setShowQuestionForm(true);
  };

  const onClickRunForm = async () => {
    setShowLoader(true);
    await sleep(3000);
    setShowLoader(false);
    setMockedData(mockedList);
    setShowQuestionForm(false);
  };

  const onClickCancelForm = () => {
    setShowQuestionForm(false);
  };

  const handleConfigBox = (id = '') => {
    const configData = _.find(configsData, data => data.id === id);
    configData.selected = true;

    setConfigs(configsData);
    setIsConfigSelected(true);
    setSelectedConfig(id);
  };

  const handleDatasetBox = (id = '') => {
    const datasetData = _.find(dataSets, data => data.id === id);
    datasetData.selected = true;

    setDataset(dataSets);
    setSelectedDataset(id);
  };

  const getFilteredDatasets = () => {
    return _.filter(datasets, data => _.includes(data.section, selectedConfig));
  };

  const onClickHandleDocs = () => {
    history.push('/docs');
  };

  const questionForm = (
    <StackingLayout style={ { marginLeft: '30px', marginRight: '70px', border: '1px solid lightgrey', padding: '30px', borderRadius: '10px' } }>
      <Title size='h2'>Test Name</Title>
      <Input
        required={ true }
        placeholder="e.g. Encoding test on Support GPT-3"
        onChange={ (e) => setTestName(e.target.value) }
      />
      <Title size='h2'>Configurations</Title>
      <FlexLayout alignItems='center'>
        {
          _.map(configs, data => {
            let linkedStyle = {};
            if (data.selected) {
              linkedStyle = { border: '3px solid #9aa5b5' };
            }
            return (
              <StackingLayout key={ data.id } className="config-box" style={ linkedStyle } onClick={ () => handleConfigBox(data.id) }>
                <FlexLayout justifyContent='space-between'>
                  <Title size='h2'>{ data.title }</Title>
                  { data.selected && <CheckMarkIcon /> }
                </FlexLayout>
                <Paragraph>{ data.need }</Paragraph>
                <Title size='h4'>API</Title>
              </StackingLayout>
            );
          })
        }
      </FlexLayout>
      {
        isConfigSelected &&
        <StackingLayout>
          <Title size='h2'>Model</Title>
          <Input
            required={ true }
            placeholder="e.g. llama-3"
            wrapperProps={ { 'data-test-id': 'default' } }
            onChange={ (e) => setModelName(e.target.value) }
          />
          {
            selectedConfig === 'rest_api' &&
            <StackingLayout>
              <Title size='h2'>API playground</Title>
              <TextArea
                name="text-area-placeholder"
                placeholder="Place your default API payload here"
                data-test-id="basic-usage"
                value={ playgroundData }
                onChange={ (e) => setPlaygroundData(e.target.value) }
                style={ { height: '350px' } }
              />
            </StackingLayout>
          }
          {
            selectedConfig !== 'rest_api' &&
            <StackingLayout>
              <Title size='h2'>Authorization API Key / Token</Title>
              <Input
                required={ true }
                placeholder="e.g. sk-0x-2d3dd33c....."
                onChange={ (e) => setAPIToken(e.target.value) }
              />
            </StackingLayout>
          }
          <Divider />
          <Title size='h2'>DataSets </Title>
          <FlexLayout alignItems='center'>
            {
              _.map(getFilteredDatasets(), set => {
                let linkedStyle = {};
                if (set.selected) {
                  linkedStyle = { border: '3px solid #9aa5b5' };
                }
                return (
                  <StackingLayout key={ set.id } className="dataset-box" style={ linkedStyle } onClick={ () => handleDatasetBox(set.id) }>
                    <FlexLayout justifyContent='space-between'>
                      <Title size='h2'>{ set.name }</Title>
                      { set.selected && <CheckMarkIcon /> }
                    </FlexLayout>
                    <Paragraph>{ set.description }</Paragraph>
                    {
                      set.prompts &&
                      <Title size='h3'>{ set.prompts } Prompts</Title>
                    }
                    {
                      set.upload &&
                      <StackingLayout itemDisplay="block">
                        <Button type="secondary">
                          <UploadIcon /> Select Files
                        </Button>
                        <TextLabel data-test-id="type-info">
                          Upload your .csv file
                        </TextLabel>
                      </StackingLayout>
                    }
                  </StackingLayout>
                );
              })
            }
          </FlexLayout>
          {
            false &&
            <div>
              <Title size='h2'>Tokens Used</Title>
              <div style={ { width: '500px' } }>
                <Slider
                  min={ 1 }
                  max={ 50 }
                  tooltip={ true }
                  InputLabel="M"
                />
              </div>
            </div>
          }
        </StackingLayout>
      }
      <FlexLayout justifyContent="flex-end">
        <Button onClick={ onClickCancelForm }><CloseIcon />Cancel</Button>
        <Button type={ Button.ButtonTypes.SUCCESS } onClick={ onClickRunForm }><RunIcon />Run</Button>
      </FlexLayout>
    </StackingLayout>
  );

  return (
    <Loader loading={ showLoader } tip="loading and running the test ...">
      <StackingLayout>
        <FlexLayout
          justifyContent="space-between"
          alignItems="center"
          style={ { margin: '30px' }}
        >
          <Button onClick={ onClickHandleAddTest }><PlusIcon /> ADD TEST</Button>
          <Button onClick={ onClickHandleDocs }><BatchIcon />COMMUNITY</Button>
        </FlexLayout>
        { showQuestionForm && questionForm }
        <StackingLayout style={ { margin: '30px' }}>
          <Title size='h2'>TEST RUNS</Title>
          {
            _.map(mockedData, data => {
              return (
                <PlaygroundView key={ data.id } data={ data } />
              )
            })
          }
        </StackingLayout>
      </StackingLayout>
    </Loader>
  );
};

export default LandingPage;
