import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Lessons from './pages/Lessons';
import Login from './components/Login';
import CalendarView from './components/CalendarView';
import LessonForm from './components/LessonForm';
import LessonList from './components/LessonList';
import RecurringLessonModal from './components/RecurringLessonModal';
import './index.css';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Dashboard} />
        <Route path="/lessons" component={Lessons} />
        <Route path="/login" component={Login} />
        <Route path="/calendar" component={CalendarView} />
        <Route path="/lesson-form" component={LessonForm} />
        <Route path="/lesson-list" component={LessonList} />
        <Route path="/recurring-lesson" component={RecurringLessonModal} />
      </Switch>
    </Router>
  );
};

export default App;