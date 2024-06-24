import React, { useEffect, useState } from 'react';
import { getTasks } from '../../apiService/tasksApi';
import { Progress, Collapse, List, Checkbox, Button } from 'antd';
import NewObjectiveModal from '../../components/modals/modalObjectives';
import NewTaskModal from '../../components/modals/modalTasks';

const { Panel } = Collapse;
const createObjective = async (values) => {
  console.log(values)
}

const createTask = async (values) => {
  console.log(values)
}

const Objetivos = () => {
  const [goals, setGoals] = useState({});
  const [activeKey, setActiveKey] = useState([]);
  const [isObjectiveModalVisible, setIsObjectiveModalVisible] = useState(false);
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState(null);

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

  const handleCreateObjective = async (values) => {
    try {
      await createObjective(values);
      message.success('Objective created successfully!');
      // Refresh tasks after creating the new objective
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
    } catch (error) {
      message.error('Failed to create objective');
    }
  };

  const handleCreateTask = async (values) => {
    try {
      await createTask(values);
      message.success('Task created successfully!');
      // Refresh tasks after creating the new task
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
    } catch (error) {
      message.error('Failed to create task');
    }
  };

  return (
    <div className="w-full">
      <h1>Objetivos</h1>
      <Button type="primary" onClick={() => setIsObjectiveModalVisible(true)}>
        Crear nuevo objetivo
      </Button>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p>{goal.goalDescription}</p>
                <Button type="dashed" onClick={() => {
                  setSelectedGoalId(goalId);
                  setIsTaskModalVisible(true);
                }}>
                  Añadir tarea
                </Button>
              </div>
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
      <NewObjectiveModal
        visible={isObjectiveModalVisible}
        onCancel={() => setIsObjectiveModalVisible(false)}
        onCreate={handleCreateObjective}
      />
      <NewTaskModal
        visible={isTaskModalVisible}
        onCancel={() => setIsTaskModalVisible(false)}
        onCreate={handleCreateTask}
        goalId={selectedGoalId}
      />
    </div>
  );
};

export default Objetivos;