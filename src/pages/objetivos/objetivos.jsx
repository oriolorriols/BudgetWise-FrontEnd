import React, { useEffect, useState } from 'react';
import { getTasks } from '../../apiService/tasksApi';
import { Card, Progress, Button, Collapse, List, Checkbox } from 'antd';
const { Panel } = Collapse;

const Objetivos = () => {
  const [goals, setGoals] = useState({});
  const [activeKey, setActiveKey] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const tasks = await getTasks();
      // Suponiendo que tasks ya tiene la estructura que enviaste en el JSON
      const grouped = tasks.reduce((acc, item) => {
        const goalId = item.goalId._id;
        if (!acc[goalId]) {
          acc[goalId] = {
            goalName: item.goalId.goalName,
            goalDescription: item.goalId.goalDescription,
            tasks: []
          };
        }
        acc[goalId].tasks.push({
          id: item._id,
          name: item.taskName,
          description: item.taskDescription,
          status: item.taskStatus
        });
        return acc;
      }, {});
      setGoals(grouped);
    };
    fetchTasks();
  }, []);

  const togglePanel = key => {
    setActiveKey(key.length ? key : []);
  };

  return (
    <div className="w-full">
      <Collapse
        bordered={false}
        ghost
        activeKey={activeKey}
        onChange={togglePanel}
        expandIconPosition="right"
      >
        {Object.entries(goals).map(([goalId, goal]) => (
          <Panel
            header={goal.goalName}
            key={goalId}
            className="bg-white"
          >
            <p>{goal.goalDescription}</p>
            <List
              itemLayout="horizontal"
              dataSource={goal.tasks}
              renderItem={task => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Checkbox checked={task.status !== 'Pendiente'} />}
                    title={task.name}
                    description={task.description}
                  />
                </List.Item>
              )}
            />
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default Objetivos;
