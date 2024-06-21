import React, { useEffect, useState } from 'react';
import { getTasks } from '../../apiService/tasksApi';
import { Progress, Collapse, List, Checkbox } from 'antd';

const { Panel } = Collapse;

const Objetivos = () => {
  const [goals, setGoals] = useState({});
  const [activeKey, setActiveKey] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const tasks = await getTasks();
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

  const calculateProgress = tasks => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status !== 'Pendiente').length;
    return (completedTasks / totalTasks) * 100;
  };

  return (
    <div className="w-full">
      <Collapse
        bordered={true}
        activeKey={activeKey}
        onChange={togglePanel}
        expandIconPosition="right"
      >
        {Object.entries(goals).map(([goalId, goal]) => {
          const percent = calculateProgress(goal.tasks);
          const header = (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{goal.goalName}</span>
              <Progress percent={percent} type="line" style={{ width: '50%' }} />
            </div>
          );

          return (
            <Panel header={header} key={goalId}>
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
          );
        })}
      </Collapse>
    </div>
  );
};

export default Objetivos;
