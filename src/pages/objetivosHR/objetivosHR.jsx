import React, { useEffect, useState } from 'react';
import { getTasks } from '../../apiService/tasksApi';
import { Table, Badge, Space, Checkbox, Progress } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const ObjetivosHR = () => {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const tasks = await getTasks();
      const grouped = tasks.reduce((acc, item) => {
        const goalId = item.goalId._id;
        if (!acc[goalId]) {
          acc[goalId] = {
            key: goalId,
            goalName: item.goalId.goalName,
            goalDescription: item.goalId.goalDescription,
            employeeName: item.goalId.employeeId?.name || 'N/A',
            tasks: []
          };
        }
        acc[goalId].tasks.push({
          key: item._id,
          name: item.taskName,
          description: item.taskDescription,
          status: item.taskStatus
        });
        return acc;
      }, {});
      setGoals(Object.values(grouped));
    };
    fetchTasks();
  }, []);

  const calculateProgress = tasks => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status !== 'Pendiente').length;
    return (completedTasks / totalTasks) * 100;
  };

  const expandedRowRender = (record) => {
    const columns = [
      { title: 'Task Name', dataIndex: 'name', key: 'name' },
      { title: 'Description', dataIndex: 'description', key: 'description' },
      {
        title: 'Status',
        key: 'status',
        render: (text, task) => (
          <Checkbox checked={task.status !== 'Pendiente'}>{task.status}</Checkbox>
        ),
      },
    ];

    return <Table columns={columns} dataSource={record.tasks} pagination={false} />;
  };

  const columns = [
    { title: 'Objective Name', dataIndex: 'goalName', key: 'goalName' },
    { title: 'Description', dataIndex: 'goalDescription', key: 'goalDescription' },
    { title: 'Assigned To', dataIndex: 'employeeName', key: 'employeeName' },
    {
      title: 'Progress',
      key: 'progress',
      render: (text, record) => {
        const percent = calculateProgress(record.tasks);
        return <Progress percent={percent} type="line" />;
      },
    },
  ];

  return (
    <Table
      columns={columns}
      expandable={{ expandedRowRender, expandIcon: ({ expanded, onExpand, record }) =>
        <DownOutlined rotate={expanded ? 180 : 0} onClick={e => onExpand(record, e)} />
      }}
      dataSource={goals}
    />
  );
};

export default ObjetivosHR;
