import React, { useState } from 'react';

const scheduleData = [
  {
    id: 'today',
    title: 'Today',
    subtitle: '2 Slots Available',
    sessions: [
      {
        partOfDay: 'Evening',
        icon: '🌙',
        times: ['04:10 PM', '04:40 PM'],
      },
    ],
  },
  {
    id: 'tomorrow',
    title: 'Tomorrow',
    subtitle: '10 Slots Available',
    sessions: [
      {
        partOfDay: 'Afternoon',
        icon: '☀️',
        times: ['12:00 PM', '01:30 PM', '02:00 PM'],
      },
    ],
  },
  {
    id: 'sun_5_jul',
    title: 'Sun, 5 Jul',
    subtitle: '14 Slots Available',
    sessions: [
      {
        partOfDay: 'Morning',
        icon: '🌅',
        times: ['09:00 AM', '10:00 AM'],
      },
    ],
  },
];

const SlotPicker = () => {
  const [selectedDayId, setSelectedDayId] = useState(scheduleData[0].id);

  const selectedDayData = scheduleData.find((day) => day.id === selectedDayId);

  return (
    <div className="slot-picker-container" style={{ fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
        
        <button style={arrowStyle}>&lt;</button>

        <div style={{ display: 'flex', flex: 1, justifyContent: 'space-around' }}>
          {scheduleData.map((day) => {
            const isActive = day.id === selectedDayId;
            return (
              <div 
                key={day.id} 
                onClick={() => setSelectedDayId(day.id)}
                style={{ 
                  textAlign: 'center', 
                  cursor: 'pointer',
                  borderBottom: isActive ? '3px solid #00BFFF' : 'none',
                  padding: '10px',
                  flex: 1
                }}
              >
                <div style={{ fontWeight: isActive ? 'bold' : 'normal', color: '#333' }}>
                  {day.title}
                </div>
                <div style={{ fontSize: '12px', color: '#28a745' }}>
                  {day.subtitle}
                </div>
              </div>
            );
          })}
        </div>

        <button style={arrowStyle}>&gt;</button>
      </div>

      <div style={{ padding: '20px 10px' }}>
        {selectedDayData.sessions.map((session, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '20px' }}>
            
            <div style={{ width: '100px', display: 'flex', alignItems: 'center', color: '#555' }}>
              <span style={{ marginRight: '8px' }}>{session.icon}</span>
              <span>{session.partOfDay}</span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {session.times.map((time, idx) => (
                <button 
                  key={idx}
                  style={timeButtonStyle}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

const arrowStyle = {
  background: 'white',
  border: '1px solid #ccc',
  borderRadius: '50%',
  width: '35px',
  height: '35px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#00BFFF',
  fontWeight: 'bold'
};

const timeButtonStyle = {
  background: 'white',
  border: '1px solid #00BFFF',
  color: '#00BFFF',
  padding: '8px 16px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px'
};

export default SlotPicker;