import React from 'react';
import { inject, Observer, observer } from 'mobx-react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
import Posts from './pages/Posts';
import Home from './pages/Home';

const { Header, Content, Footer, Sider } = Layout;

class App extends React.Component {
    state = {
        collapsed: false,
    };

    onCollapse = (collapsed) => this.setState({ collapsed });

    render() {
        return (
            <Router>
                <Layout style={{ minHeight: '100vh' }}>
                    <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
                        <div className="logo">
                            <Link to="/">главная</Link>
                        </div>
                        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                            <Menu.Item key="1">
                                <Link to="/posts">
                                    <Icon type="copy" />
                                    <span>Статьи</span>
                                </Link>
                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Layout>
                        <Header style={{ background: '#fff', padding: 0 }} />
                        <Content style={{ margin: '0 16px' }}>
                            <div style={{ margin: '16px 0', padding: 24, background: '#fff', minHeight: 360 }}>
                                <Route path="/" exact component={Home} />
                                <Route path="/posts/" component={Posts} />
                            </div>
                        </Content>
                        <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
                    </Layout>
                </Layout>
            </Router>
        );
    }
}

export default App;
