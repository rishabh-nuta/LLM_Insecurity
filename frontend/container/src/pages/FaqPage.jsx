import React from 'react';

import {
  FlexLayout,
  StackingLayout,
  Title,
  Paragraph,
  TextLabel
} from '@nutanix-ui/prism-reactjs';

const FaqPage = () => {
  return (
    <StackingLayout>
      <FlexLayout justifyContent='center'>
        <Title size="h2" style={{ fontSize: '22px', fontWeight: 450 }}>
          COMMUNITY
        </Title>
      </FlexLayout>
      <StackingLayout>
        <StackingLayout>
          <Title size="h3" style={{ fontSize: '18px', fontWeight: 450 }}>prompt injection mitigations</Title>
          <Paragraph forceMultiLineHeight={ true } >
            - enforce privilege control on LLM access to backend system, separating external content from user prompts.
            - add human-in-the-loop for critical operations
          </Paragraph>
          <TextLabel
            size={ TextLabel.TEXT_LABEL_SIZE.MEDIUM }
            type={ TextLabel.TEXT_LABEL_TYPE.SECONDARY }
          >
            apply to following probes: promptinjections
          </TextLabel>
        </StackingLayout>
      </StackingLayout>
    </StackingLayout>
  );
};

export default FaqPage;
