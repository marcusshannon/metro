import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import { cx, css } from 'emotion';
import { withRouter } from 'react-router';
import moment from 'moment';

const locations = [
  'Allston',
  'Almon',
  'Arrow',
  'Bayers Lake',
  'Clifton',
  'Commonwealth',
  'Glendale',
  'Grenache',
  'Joseph Zatzman',
  'Kenmount',
  'Liberty',
  'Lovett',
  'Price',
  'Riordon',
  'Thornhill',
  'Topsail',
  'Upham',
  'Vidito',
  'Walker',
  'Water',
  'White Rose',
  'Wilkinson',
  'Williams',
  'Willow',
].sort();

const initialState = {
  sr: {
    srNumber: '',
    location: locations[0],
    startTravel: null,
    endTravel: null,
    startTask: null,
    endTask: null,
    description: '',
    status: null,
  },
  name: localStorage.getItem('name') || '',
};

class ScrollToTop extends Component {
  componentDidMount() {
    this.props.history.replace('/');
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return null;
  }
}

ScrollToTop = withRouter(ScrollToTop);

const Button = ({ children, disabled, className, ...rest }) => (
  <div
    key={Math.random()}
    {...rest}
    className={cx(
      className,
      disabled ? 'bg-grey-dark' : 'bg-orange',
      !disabled && 'cursor-pointer',
      'p-5 rounded text-white text-center text-3xl shadow flex-no-shrink',
    )}
  >
    {children}
  </div>
);

class Timer extends Component {
  state = {
    inProgress: false,
    startTime: null,
    timerStart: 0,
  };

  static defaultProps = {
    startText: 'Start',
    endText: 'End',
    onEndClick: () => {},
  };

  static pad = num => ('0' + num).slice(-2);

  static format = seconds => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return (
      Timer.pad(hours) +
      ':' +
      Timer.pad(minutes % 60) +
      ':' +
      Timer.pad(seconds % 60)
    );
  };

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return (
      <div className="w-3/4">
        <h1 className="text-center mb-3 text-black">
          {this.state.inProgress
            ? Timer.format(this.state.now.diff(this.state.startTime, 'seconds'))
            : '00:00:00'}
        </h1>
        <div className="flex flex-col sm:flex-row">
          {!this.state.inProgress && (
            <Button
              className="flex-1"
              onClick={() => {
                this.setState({
                  startTime: moment(),
                  inProgress: true,
                  now: moment(),
                });
                this.timer = setInterval(
                  () => this.setState({ now: moment() }),
                  1000,
                );
              }}
            >
              {this.props.startText}
            </Button>
          )}
          {this.state.inProgress && (
            <Button className="flex-1" disabled={true}>
              {this.props.startText}
            </Button>
          )}
          <div className="w-5 h-5" />
          {!this.state.inProgress && (
            <Button className="flex-1" disabled={true}>
              {this.props.endText}
            </Button>
          )}
          {this.state.inProgress && (
            <Button
              className="flex-1"
              onClick={() =>
                this.props.onEndClick(this.state.startTime, moment())
              }
            >
              {this.props.endText}
            </Button>
          )}
        </div>
      </div>
    );
  }
}

class App extends Component {
  state = initialState;

  onSubmit = body =>
    fetch(
      'https://us-central1-maintenance-208601.cloudfunctions.net/uploadToSheets',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    );

  render() {
    return (
      <div
        className={cx(
          css`
            background-color: #ffffff;
            background-image: url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ecca93' fill-opacity='0.09'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          `,
          'h-screen w-screen flex items-center justify-center border-t-8 border-orange',
        )}
      >
        <Router>
          <React.Fragment>
            <ScrollToTop />
            <Switch>
              <Route
                path="/name"
                exact={true}
                render={({ history }) => (
                  <React.Fragment key="/name">
                    <div>
                      <input
                        type="text"
                        className="border mb-3 p-3 rounded"
                        placeholder="Name"
                        value={this.state.name}
                        onChange={e =>
                          this.setState({
                            name: e.target.value,
                          })
                        }
                      />
                      <Button
                        onClick={() => {
                          localStorage.setItem('name', this.state.name);
                          history.push('/');
                        }}
                      >
                        Set
                      </Button>
                    </div>
                  </React.Fragment>
                )}
              />
              <Route
                path="/"
                exact={true}
                render={({ history }) => (
                  <React.Fragment key="/">
                    {!this.state.name && <Redirect to="/name" />}
                    <div className="w-3/4 flex flex-col sm:flex-row">
                      <Button
                        onClick={() => history.push('/sr-1')}
                        className="flex-1"
                      >
                        Service Request
                      </Button>
                      <div className="w-5 h-5" />
                      <Button
                        onClick={() => history.push('/break')}
                        className="flex-1"
                      >
                        Break / Lunch
                      </Button>
                    </div>
                    <div
                      onClick={() => history.push('/name')}
                      className={cx(
                        css`
                          position: absolute;
                          top: 20px;
                          left: 10px;
                        `,
                        'text-orange border-orange border p-3 rounded',
                      )}
                    >
                      Set name
                    </div>
                  </React.Fragment>
                )}
              />
              <Route
                path="/sr-1"
                exact={true}
                render={({ history }) => (
                  <React.Fragment key="sr-1">
                    <div className="w-1/2">
                      <input
                        type="text"
                        className="border mb-6 p-3 rounded text-xl sm:text-3xl w-full"
                        placeholder="Service Request #"
                        value={this.state.sr.srNumber}
                        onChange={e =>
                          this.setState({
                            sr: { ...this.state.sr, srNumber: e.target.value },
                          })
                        }
                      />
                      <Button onClick={() => history.push('/sr-2')}>
                        Next
                      </Button>
                    </div>
                  </React.Fragment>
                )}
              />
              <Route
                path="/sr-2"
                exact={true}
                render={({ history }) => (
                  <React.Fragment key="sr-2">
                    <div className="w-1/2">
                      <select
                        className="mb-6 p-3 text-xl sm:text-3xl w-full"
                        value={this.state.sr.location}
                        onChange={e =>
                          this.setState({
                            sr: { ...this.state.sr, location: e.target.value },
                          })
                        }
                      >
                        {locations.map(loc => (
                          <option key={loc} value={loc}>
                            {loc}
                          </option>
                        ))}
                      </select>
                      <Button onClick={() => history.push('/sr-3')}>
                        Next
                      </Button>
                    </div>
                  </React.Fragment>
                )}
              />
              <Route
                path="/sr-3"
                exact={true}
                render={({ history }) => (
                  <React.Fragment key="sr-3">
                    <div className="w-3/4">
                      <h1 className="text-black text-center mb-3">
                        Travelling?
                      </h1>
                      <div className="flex flex-col sm:flex-row">
                        <Button
                          className="flex-1"
                          onClick={() => history.push('/sr-4')}
                        >
                          Yes
                        </Button>
                        <div className="w-5 h-5" />
                        <Button
                          className="flex-1"
                          onClick={() => history.push('/sr-5')}
                        >
                          No
                        </Button>
                      </div>
                    </div>
                  </React.Fragment>
                )}
              />
              <Route
                path="/sr-4"
                exact={true}
                render={({ history }) => (
                  <React.Fragment key="sr-4">
                    <Timer
                      onEndClick={(startTravel, endTravel) => {
                        this.setState({
                          sr: { ...this.state.sr, startTravel, endTravel },
                        });
                        history.push('/sr-5');
                      }}
                      startText="Start Travel"
                      endText="End Travel"
                    />
                  </React.Fragment>
                )}
              />
              <Route
                path="/sr-5"
                exact={true}
                render={({ history }) => (
                  <React.Fragment key="sr-5">
                    <Timer
                      onEndClick={(startTask, endTask) => {
                        this.setState({
                          sr: { ...this.state.sr, startTask, endTask },
                        });
                        history.push('/sr-6');
                      }}
                      startText="Start Work"
                      endText="End Work"
                    />
                  </React.Fragment>
                )}
              />
              <Route
                path="/sr-6"
                exact={true}
                render={({ history }) => (
                  <React.Fragment key="sr-6">
                    <div className="w-3/4">
                      <h1 className="text-black mb-3 text-center">
                        Description of work completed
                      </h1>
                      <textarea
                        className="border w-full mb-3 h-32"
                        value={this.state.sr.description}
                        onChange={e =>
                          this.setState({
                            sr: {
                              ...this.state.sr,
                              description: e.target.value,
                            },
                          })
                        }
                      />
                      <Button onClick={() => history.push('/sr-7')}>
                        Next
                      </Button>
                    </div>
                  </React.Fragment>
                )}
              />
              <Route
                path="/sr-7"
                exact={true}
                render={({ history }) => (
                  <React.Fragment key="sr-7">
                    <div className="w-3/4">
                      <h1 className="text-black mb-3 text-center">
                        Task Status
                      </h1>
                      <div className="flex flex-col sm:flex-row">
                        <Button
                          onClick={() => {
                            this.setState({
                              sr: { ...this.state.sr, status: 'Complete' },
                            });
                            history.push('/sr-8');
                          }}
                          className="flex-1"
                        >
                          Complete
                        </Button>
                        <div className="w-5 h-5" />
                        <Button
                          onClick={() => {
                            this.setState({
                              sr: {
                                ...this.state.sr,
                                status: 'Work in progress',
                              },
                            });
                            history.push('/sr-8');
                          }}
                          className="flex-1"
                        >
                          WIP
                        </Button>
                      </div>
                    </div>
                  </React.Fragment>
                )}
              />
              <Route
                path="/sr-8"
                exact={true}
                render={({ history }) => (
                  <React.Fragment key="sr-8">
                    <Button
                      onClick={() => {
                        this.onSubmit([
                          moment().format('M/D/Y'),
                          this.state.name,
                          '',
                          this.state.sr.srNumber,
                          this.state.sr.location,
                          this.state.sr.startTravel
                            ? this.state.sr.startTravel.format('HH:mm:ss')
                            : 'No Travel',
                          this.state.sr.endTravel
                            ? this.state.sr.endTravel.format('HH:mm:ss')
                            : 'No Travel',
                          this.state.sr.startTask.format('HH:mm:ss'),
                          this.state.sr.endTask.format('HH:mm:ss'),
                          this.state.sr.description,
                          this.state.sr.status,
                        ]);
                        this.setState(initialState);
                        history.push('/');
                      }}
                    >
                      Submit
                    </Button>
                  </React.Fragment>
                )}
              />
              <Route
                path="/break"
                exact={true}
                render={({ history }) => (
                  <React.Fragment key="break">
                    <Timer
                      onEndClick={(startBreak, endBreak) => {
                        this.onSubmit([
                          moment().format('M/D/Y'),
                          this.state.name,
                          '',
                          'Break/Lunch',
                          'Break/Lunch',
                          '',
                          '',
                          startBreak.format('HH:mm:ss'),
                          endBreak.format('HH:mm:ss'),
                          'Break/Lunch',
                        ]);
                        history.push('/');
                        this.setState({ break: { startBreak, endBreak } });
                      }}
                      startText="Start Break"
                      endText="End Break"
                    />
                  </React.Fragment>
                )}
              />
            </Switch>
          </React.Fragment>
        </Router>
      </div>
    );
  }
}

export default App;
