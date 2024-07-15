import React, { useState, useEffect } from 'react';
import { Badge, Calendar } from 'antd';
import { getAbsences } from '../../apiService/absencesApi';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es')

const getListData = (value, absences) => {
  const date = new Date(value);
  return absences
    .filter(absence => {
      const startDate = new Date(absence.startDate);
      const endDate = new Date(absence.endDate);
      return date >= startDate && date <= endDate;
    })
    .map(absence => ({
      type: 'success', // Puedes ajustar el tipo según tu necesidad
      content: `${absence.absenceName} - ${absence.city}, ${absence.country}`
    }));
};

const Calendario = () => {
  const [absences, setAbsences] = useState([]);

  useEffect(() => {
    const fetchAbsences = async () => {
      const fetchedAbsences = await getAbsences();
      setAbsences(fetchedAbsences);
    };

    fetchAbsences();
  }, []);

  const dateCellRender = (value) => {
    const listData = getListData(value, absences);
    return (
      <ul className="events" style={{ padding: 0, margin: 0, listStyleType: 'none' }}>
        {listData.map((item, index) => (
          <li key={index} style={{ backgroundColor: '#f0f0f0', margin: '5px 0', padding: '5px', borderRadius: '4px' }}>
            <Badge status={item.type} text={item.content} style={{ backgroundColor: 'transparent' }} />
          </li>
        ))}
      </ul>
    );
  };

  const monthCellRender = (value) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };

  const cellRender = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);
    if (info.type === 'month') return monthCellRender(current);
    return info.originNode;
  };

  const headerRender = ({ value, onChange }) => {
    const handlePrevMonth = () => {
      const newValue = value.clone().subtract(1, 'month');
      onChange(newValue);
    };

    const handleNextMonth = () => {
      const newValue = value.clone().add(1, 'month');
      onChange(newValue);
    };

    return (
      <div className='flex flex-row justify-between py-4 font-bold text-xl'>
        <LeftOutlined onClick={handlePrevMonth} />
        <span>{value.format('MMMM YYYY')}</span>
        <RightOutlined onClick={handleNextMonth} />
      </div>
    );
  };

  return (
    <div>
      <Calendar cellRender={cellRender} headerRender={headerRender}/>
    </div>
  );
};

export default Calendario;