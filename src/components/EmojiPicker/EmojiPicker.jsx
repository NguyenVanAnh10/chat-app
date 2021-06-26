import React, { memo } from 'react';
import { Box, SimpleGrid, Tabs, TabList, TabPanels, Tab, TabPanel,
  Heading } from '@chakra-ui/react';

import Emoji from 'components/Emoji';
import emojiBlocks from './emoji';
import data from './data.json';

const { catagory, emojis } = data;

const EmojiPicker = memo(({ onSelect }) => (
  <Tabs>
    <TabList>
      <Tab px="1" _focus="none">
        &#x1F606;
      </Tab>
    </TabList>
    <TabPanels>
      <TabPanel px="0" pb="0" pt="2">
        <Box h="300px" overflow="auto">
          {emojiBlocks.map(e => (
            <React.Fragment key={e.key}>
              <Heading size="sm">{e.title}</Heading>
              <SimpleGrid columns={9} spacing="2">
                {catagory[e.key].map(id => (
                  <Emoji
                    key={id}
                    coordinates={emojis[id]}
                    text={id}
                    onClick={() => onSelect({
                      key: id,
                      coordinates: emojis[id],
                    })}
                  />
                ))}
              </SimpleGrid>
            </React.Fragment>
          ))}
        </Box>
      </TabPanel>
    </TabPanels>
  </Tabs>
));

export default EmojiPicker;
