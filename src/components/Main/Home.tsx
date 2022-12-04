import React from 'react';
import { Chrono } from 'react-chrono';
import { TimelineItemModel } from 'react-chrono/dist/models/TimelineItemModel';

export const Home = () => {
  const items = [
    {
      title: 'May 1940',
      cardTitle: 'Dunkirk',
      url: 'http://www.history.com',
      cardSubtitle: 'Men of the British Expeditionary Force (BEF) wade out to..',
      cardDetailedText: 'Men of the British Expeditionary Force (BEF) wade out to..',
      media: {
        type: 'IMAGE',
        source: {
          url: 'http://someurl/image.jpg',
        },
      },
    },
    {
      title: 'Jan. 26, 1962',
      cardTitle: 'Ranger crashes into moon',
      cardSubtitle: 'Unmanned Ranger sent to crash into moon but misses target.',
    },
  ] as TimelineItemModel[];

  return (
    <div style={{ width: '500px', height: '400px' }}>
      <Chrono items={items} />
    </div>
  );
};
