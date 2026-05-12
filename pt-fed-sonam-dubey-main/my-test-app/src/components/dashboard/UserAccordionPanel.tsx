import { memo } from 'react'
import type { User } from '../../types/user'
import { formatLastLogin } from '../../utils/userUtils'

interface UserAccordionPanelProps {
  user: User
  isExpanded: boolean
}

function UserAccordionPanelComponent({ user, isExpanded }: UserAccordionPanelProps) {
  return (
    <div className={`accordion-panel ${isExpanded ? 'expanded' : ''}`}>
      <div className="accordion-panel-content">
        <div className="panel-grid">
          <section>
            <h4>Recent activity logs</h4>
            <ul>
              {user.details.recentActivityLogs.map((entry) => (
                <li key={entry}>{entry}</li>
              ))}
            </ul>
          </section>

          <section>
            <h4>Updates made</h4>
            <ul>
              {user.details.updatesMade.map((entry) => (
                <li key={entry}>{entry}</li>
              ))}
            </ul>
          </section>

          <section>
            <h4>Login attempts</h4>
            <ul>
              {user.details.loginAttempts.map((entry) => (
                <li key={entry}>{entry}</li>
              ))}
            </ul>
          </section>

          <section>
            <h4>Security profile</h4>
            <ul>
              <li>Password age: {user.security.passwordAgeDays} days</li>
              <li>
                Last password update:{' '}
                {formatLastLogin(user.security.lastPasswordUpdate)}
              </li>
              <li>2FA enabled: {user.security.twoFactorEnabled ? 'Yes' : 'No'}</li>
            </ul>
            <h4>Security settings</h4>
            <ul>
              {user.security.securitySettings.map((entry) => (
                <li key={entry}>{entry}</li>
              ))}
            </ul>
          </section>

          <section>
            <h4>Assigned groups/permissions</h4>
            <ul>
              <li>Groups: {user.groups.join(', ')}</li>
              <li>Permissions: {user.permissions.join(', ')}</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}

export const UserAccordionPanel = memo(UserAccordionPanelComponent)
