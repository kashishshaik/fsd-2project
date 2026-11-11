import { useState } from 'react'
import './App.css'

function App() {
  const [screen, setScreen] = useState('portal')
  const [isAdmin, setIsAdmin] = useState(false)
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [showForm, setShowForm] = useState(false)

  const [issues, setIssues] = useState(() => {
    try {
      const saved = localStorage.getItem('labfix_issues')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [formData, setFormData] = useState({
    lab: '', computer: '', category: '', description: ''
  })

  function choosePortal(admin) {
    setIsAdmin(admin)
    setLoginId('')
    setPassword('')
    setLoginError('')
    setScreen(admin ? 'adminLogin' : 'studentLogin')
  }

  function handleLogin(e) {
    e.preventDefault()
    const valid = isAdmin
      ? loginId === 'admin' && password === 'admin123'
      : loginId === 'student' && password === 'student123'

    if (!valid) {
      setLoginError('Incorrect ID or password. Please try again.')
      return
    }

    setLoginError('')
    setShowForm(false)
    setScreen('dashboard')
  }

  function logout() {
    setScreen('portal')
    setLoginId('')
    setPassword('')
    setLoginError('')
    setShowForm(false)
  }

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  function saveIssues(updatedIssues) {
    setIssues(updatedIssues)
    try {
      localStorage.setItem('labfix_issues', JSON.stringify(updatedIssues))
    } catch {
      alert('Unable to save reports in this browser.')
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    const newIssue = {
      id: Date.now(),
      ...formData,
      status: 'New',
      date: new Date().toLocaleDateString(),
      note: 'Waiting for lab staff review'
    }
    saveIssues([...issues, newIssue])
    setFormData({ lab: '', computer: '', category: '', description: '' })
    setShowForm(false)
    alert('Your issue has been submitted successfully!')
  }

  function updateIssueStatus(issueId, newStatus) {
    const note = newStatus === 'New'
      ? 'Waiting for lab staff review'
      : newStatus === 'In Progress'
        ? 'Lab staff is working on this issue'
        : 'This issue has been resolved'

    saveIssues(issues.map(issue =>
      issue.id === issueId ? { ...issue, status: newStatus, note } : issue
    ))
  }

  const newCount = issues.filter(issue => issue.status === 'New').length
  const progressCount = issues.filter(issue => issue.status === 'In Progress').length
  const resolvedCount = issues.filter(issue => issue.status === 'Resolved').length

  const statusClass = status =>
    `status-pill status-${status.toLowerCase().replace(' ', '-')}`

  return (
    <div className="app">
      <nav className="navbar">
        <button className="logo logo-button" onClick={logout}>Lab<span>Fix</span></button>
        {screen === 'dashboard' ? (
          <>
            <div className="nav-links">
              <a href="#dashboard">Dashboard</a>
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
            </div>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </>
        ) : (
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
          </div>
        )}
      </nav>

      {screen === 'portal' && (
        <>
          <section className="hero" id="home">
            <div className="hero-content">
              <p className="tagline">SMART LAB MANAGEMENT</p>
              <h1>Your Lab Issues,<br /><span>Our Priority.</span></h1>
              <p className="hero-description">
                Report computer problems, track repair progress and help keep your
                college laboratory running smoothly.
              </p>
              <div className="hero-buttons">
                <button className="primary-btn" onClick={() => choosePortal(false)}>
                  Get Started →
                </button>
                <a href="#how-it-works" className="secondary-btn">How It Works</a>
              </div>
            </div>
            <div className="hero-card">
              <div className="card-top"><span>Issue Overview</span><span className="live-dot">● Live</span></div>
              <div className="issue-number">{issues.length}</div>
              <p className="muted">Total reported issues</p>
              <div className="issue-row"><span>New Issues</span><strong>{newCount}</strong></div>
              <div className="issue-row"><span>In Progress</span><strong>{progressCount}</strong></div>
              <div className="issue-row"><span>Resolved</span><strong>{resolvedCount}</strong></div>
              <div className="status-message">✓ Manage your lab issues in one place</div>
            </div>
          </section>

          <section className="portal-choice-section">
            <div className="section-heading">
              <p>WELCOME TO LABFIX</p>
              <h2>Choose Your Portal</h2>
              <span>Select the portal you want to access.</span>
            </div>
            <div className="portal-choice-grid">
              <div className="portal-choice-card">
                <div className="feature-icon">🎓</div>
                <h3>Student Portal</h3>
                <p>Report laboratory problems and track the progress of your reports.</p>
                <button className="primary-btn" onClick={() => choosePortal(false)}>Student Login</button>
              </div>
              <div className="portal-choice-card">
                <div className="feature-icon">🛠️</div>
                <h3>Admin Portal</h3>
                <p>View student reports and update issue status as work progresses.</p>
                <button className="primary-btn admin-choice-btn" onClick={() => choosePortal(true)}>Admin Login</button>
              </div>
            </div>
          </section>
        </>
      )}

      {(screen === 'studentLogin' || screen === 'adminLogin') && (
        <section className="login-panel">
          <div className="login-card">
            <div className="login-icon">{isAdmin ? '🛠️' : '🎓'}</div>
            <p className="login-eyebrow">{isAdmin ? 'ADMIN ACCESS' : 'STUDENT ACCESS'}</p>
            <h2>{isAdmin ? 'Admin Login' : 'Student Login'}</h2>
            <p className="login-description">
              {isAdmin
                ? 'Sign in to review reports and manage laboratory issues.'
                : 'Sign in to report problems and track your submissions.'}
            </p>
            <form className="portal-login-form" onSubmit={handleLogin}>
              <label htmlFor="login-id">{isAdmin ? 'Admin ID' : 'Student ID'}</label>
              <input
                id="login-id"
                type="text"
                placeholder={isAdmin ? 'Enter Admin ID' : 'Enter Student ID'}
                value={loginId}
                onChange={e => setLoginId(e.target.value)}
                autoComplete="username"
                required
              />
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              {loginError && <p className="login-error" role="alert">{loginError}</p>}
              <button type="submit" className="submit-btn portal-submit-btn">Login</button>
            </form>
            <div className="demo-credentials">
              <strong>Demo login credentials</strong>
              {isAdmin ? (
                <span>ID: <b>admin</b> | Password: <b>admin123</b></span>
              ) : (
                <span>ID: <b>student</b> | Password: <b>student123</b></span>
              )}
            </div>
            <button className="back-portal-btn" onClick={logout}>← Back to portal selection</button>
            <p className="login-security-note">
              Demo only: these credentials are checked in the browser and are not secure production authentication.
            </p>
          </div>
        </section>
      )}

      {screen === 'dashboard' && !isAdmin && (
        <section className="student-dashboard" id="dashboard">
          <div className="dashboard-heading">
            <p>STUDENT PORTAL</p>
            <h2>My Lab Dashboard</h2>
            <span>Report problems and keep track of your complaints.</span>
          </div>
          <div className="dashboard-summary">
            <div className="summary-card"><h3>{issues.length}</h3><p>Total Reports</p></div>
            <div className="summary-card"><h3>{newCount}</h3><p>New Reports</p></div>
            <div className="summary-card"><h3>{resolvedCount}</h3><p>Resolved Reports</p></div>
          </div>
          <div className="report-action">
            <div><h3>Having a computer problem?</h3><p>Submit your issue so lab staff can review it.</p></div>
            <button className="report-btn" onClick={() => setShowForm(v => !v)}>
              {showForm ? 'Close Form' : '+ Report an Issue'}
            </button>
          </div>
          {showForm && (
            <form className="issue-form" onSubmit={handleSubmit}>
              <h3>Report a New Issue</h3>
              <label htmlFor="lab">Lab Number</label>
              <input id="lab" type="number" name="lab" min="1" placeholder="Enter Lab Number" value={formData.lab} onChange={handleChange} required />
              <label htmlFor="computer">Computer Number</label>
              <input id="computer" type="number" name="computer" min="1" placeholder="Example: 12" value={formData.computer} onChange={handleChange} required />
              <label htmlFor="category">Problem Category</label>
              <select id="category" name="category" value={formData.category} onChange={handleChange} required>
                <option value="">Select Problem</option>
                <option value="Hardware">Hardware Problem</option>
                <option value="Software">Software Problem</option>
                <option value="Internet">Internet / Wi-Fi</option>
                <option value="Keyboard">Keyboard / Mouse</option>
                <option value="Other">Other</option>
              </select>
              <label htmlFor="description">Describe Your Problem</label>
              <textarea id="description" name="description" rows="4" placeholder="Explain what happened..." value={formData.description} onChange={handleChange} required />
              <button type="submit" className="submit-btn">Submit Report</button>
            </form>
          )}
          <div className="my-issues">
            <h3>My Reported Issues</h3>
            {issues.length === 0 ? (
              <div className="empty-message"><div>📋</div><h4>No issues reported yet</h4><p>Your submitted complaints will appear here.</p></div>
            ) : issues.map(issue => (
              <div className="issue-item" key={issue.id}>
                <div className="issue-item-top"><h4>{issue.category} Issue</h4><span className={statusClass(issue.status)}>{issue.status}</span></div>
                <p><strong>Location:</strong> Lab {issue.lab}</p>
                <p><strong>Computer:</strong> {issue.computer}</p>
                <p><strong>Description:</strong> {issue.description}</p>
                <p><strong>Reported on:</strong> {issue.date}</p>
                <p><strong>Staff update:</strong> {issue.note}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {screen === 'dashboard' && isAdmin && (
        <section className="student-dashboard" id="dashboard">
          <div className="dashboard-heading">
            <p>ADMIN PANEL</p><h2>LabFix Admin Dashboard</h2>
            <span>Manage and track all student complaints.</span>
          </div>
          <div className="dashboard-summary admin-summary">
            <div className="summary-card"><h3>{issues.length}</h3><p>Total Issues</p></div>
            <div className="summary-card"><h3>{newCount}</h3><p>New Issues</p></div>
            <div className="summary-card"><h3>{progressCount}</h3><p>In Progress</p></div>
            <div className="summary-card"><h3>{resolvedCount}</h3><p>Resolved Issues</p></div>
          </div>
          <div className="my-issues">
            <h3>All Student Reports</h3>
            {issues.length === 0 ? (
              <div className="empty-message"><div>📋</div><h4>No reports available</h4><p>Student reports will appear here.</p></div>
            ) : issues.map(issue => (
              <div className="issue-item" key={issue.id}>
                <div className="issue-item-top"><h4>{issue.category} Issue</h4><span className={statusClass(issue.status)}>{issue.status}</span></div>
                <p><strong>Lab Number:</strong> {issue.lab}</p>
                <p><strong>Computer Number:</strong> {issue.computer}</p>
                <p><strong>Description:</strong> {issue.description}</p>
                <p><strong>Reported on:</strong> {issue.date}</p>
                <p><strong>Staff update:</strong> {issue.note}</p>
                <label htmlFor={`status-${issue.id}`}>Update Issue Status</label>
                <select id={`status-${issue.id}`} className="status-select" value={issue.status} onChange={e => updateIssueStatus(issue.id, e.target.value)}>
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            ))}
          </div>
          <p className="admin-notice">Admin demonstration portal: login is for project demonstration only. Real authentication requires a secure backend.</p>
        </section>
      )}

      <section className="features" id="features">
        <div className="section-heading"><p>WHAT WE OFFER</p><h2>Everything Your Lab Needs</h2><span>A simple way to report, manage and resolve laboratory problems.</span></div>
        <div className="feature-grid">
          <div className="feature-card"><div className="feature-icon">📝</div><h3>Report Issues</h3><p>Submit computer problems with lab and computer details.</p></div>
          <div className="feature-card"><div className="feature-icon">🔍</div><h3>Track Progress</h3><p>Check the status of your reported issues.</p></div>
          <div className="feature-card"><div className="feature-icon">🛠️</div><h3>Quick Management</h3><p>Lab staff can manage complaints and update repair information.</p></div>
        </div>
      </section>

      <section className="how-section" id="how-it-works">
        <p>GET STARTED</p><h2>How LabFix Works</h2>
        <div className="steps">
          <div><span>01</span><h3>Report</h3><p>Student submits a lab issue.</p></div>
          <div><span>02</span><h3>Review</h3><p>Staff reviews the complaint.</p></div>
          <div><span>03</span><h3>Resolve</h3><p>Staff fixes and updates the issue.</p></div>
        </div>
      </section>

      <footer><h2>Lab<span>Fix</span></h2><p>Making college laboratories smarter, one issue at a time.</p><small>© 2026 LabFix. All rights reserved.</small></footer>
    </div>
  )
}

export default App
