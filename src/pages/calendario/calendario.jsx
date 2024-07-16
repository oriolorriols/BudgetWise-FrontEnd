import React, { useState, useEffect } from 'react';
import { Badge, Calendar, Tooltip, Spin } from 'antd';
import { getAbsences } from '../../apiService/absencesApi';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');

// Función para generar un color de fondo único
const getRandomColor = () => {
  const getRandomValue = () => Math.floor(Math.random() * 56) + 200; // valores entre 200 y 255
  const r = getRandomValue();
  const g = getRandomValue();
  const b = getRandomValue();
  return `rgb(${r}, ${g}, ${b})`;
};

const getListData = (value, absences) => {
  const date = new Date(value);
  return absences
    .filter(absence => {
      const startDate = new Date(absence.startDate);
      const endDate = new Date(absence.endDate);
      return date >= startDate && date <= endDate;
    })
    .map(absence => ({
      title: date.toDateString() === new Date(absence.startDate).toDateString() ? `${absence.city}, ${absence.country}` : '',
      content: date.toDateString() === new Date(absence.startDate).toDateString() ? `${absence.absenceName}` : '',
      backgroundColor: absence.backgroundColor || getRandomColor() // Asigna un color de fondo único si no existe
    }));
};

const Calendario = () => {
  const [absences, setAbsences] = useState([]);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAbsences = async () => {
      setLoading(true)
      const fetchedAbsences = await getAbsences();
      // Asigna un color de fondo único a cada ausencia
      const absencesWithColor = fetchedAbsences.map(absence => ({
        ...absence,
        backgroundColor: getRandomColor()
      }));
      setAbsences(absencesWithColor);
      setLoading(false)
    };

    fetchAbsences();
  }, []);

  const dateCellRender = (value) => {
    const listData = getListData(value, absences);
    return (
      <ul className="events" style={{ padding: 0, margin: 0, listStyleType: 'none' }}>
        {listData.map((item, index) => (
         <Tooltip key={index} title={item.title}>
          <li className='list-none px-5' style={{ backgroundColor: item.backgroundColor, height: '100%' }}>
            <Badge color="rgba(0,0,0,0)" text={item.content} style={{ backgroundColor: 'transparent' }} />
          </li>
        </Tooltip>
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-dvh">
        <Spin size="large" />
      </div>
    )
  }


  return (
    <div style={{ height: '650px' }}> {/* Ajusta la altura del calendario aquí */}
      <Calendar cellRender={cellRender} headerRender={headerRender} />
    </div>
  );
};

export default Calendario;