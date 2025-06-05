  import { useCommitteeAccess } from '@hooks/useCommitteeAccess';
import { Routes, Route, useParams } from 'react-router-dom'

  export const CommitteeRoutes = () => {
      return (
          <Routes>
              <Route path="/" element={<CommitteeSelectPage />} />
              <Route path="/:committeeId" element={<CommitteeContentPage />} />
          </Routes>
      )
  }

  const CommitteeSelectPage = () => {
    const { availableCommittees } = useCommitteeAccess();
      return (
          <div>
              <h1>Select a Committee</h1>
              {/* Your committee selection/list content here */}
              {availableCommittees}
          </div>
      )
  }

  const CommitteeContentPage = () => {
      const { committeeId } = useParams()
    
      return (
          <div>
              <h1>Committee: {committeeId}</h1>
              {/* Your specific committee content here */}
          </div>
      )
  }