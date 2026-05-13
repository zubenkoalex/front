import { FC } from "react";
import { Route, Routes } from 'react-router-dom';
import "./App.scss";
import 'react-loading-skeleton/dist/skeleton.css'
import 'highlight.js/styles/atom-one-dark.css';
import { Authorization, Dashboard, Landing, PlansPage, AiChatPage, CompaniesHistoryPage, CreateAnimation, Creatives, Forecasts, HomePage, MainInfo, NewCompanyPage, Registration, TargetPeople, CompanyPage } from "./pages";

const App: FC = () => {
  
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Authorization />} />
      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<HomePage />} />
        <Route path="new-company" element={<NewCompanyPage />}>
          <Route index element={<MainInfo />} />
          <Route path="target-people" element={<TargetPeople />} />
          <Route path="creatives" element={<Creatives />} />
          <Route path="forecasts" element={<Forecasts />} />
          <Route path="registration" element={<Registration />} />
          <Route path="create-animation" element={<CreateAnimation />} />
        </Route>
        <Route path="chat" element={<AiChatPage />} />
        <Route path="chat/:chatId" element={<AiChatPage />} />
        <Route path="companies-history" element={<CompaniesHistoryPage />} />
        <Route path="companies-history/:companyId" element={<CompanyPage />} />
        <Route path="plans" element={<PlansPage />} />
      </Route>
      {/* <Route path="*" element={<Empty  />} /> Спасает от ошибок */}
    </Routes>
  );
};

export default App;