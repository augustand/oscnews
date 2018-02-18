import React, { Component } from 'react';
import styles from './index.less';
import addIcon from '../../assets/add-icon.png';
import Edit from './Edit';
// import Contextmenu from "../../component/Contextmenu";

export default class Navigation extends Component {
  static typeName = 'navigation'
  constructor(props) {
    super(props);
    this.state = {
      navContent: props.dbs.nav,
      optionDown: false,
      // navContent: [
      //   {
      //     label: '500px',
      //     value: 'https://500px.com/',
      //     icon: 'https://jaywcjlove.github.io/logo/500px.png',
      //   },
      // ],
    };
    this.handleResize = this.handleResize.bind(this);
    this.handleClickOption = this.handleClickOption.bind(this);
    this.handleClickOptionUp = this.handleClickOptionUp.bind(this);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleClickOption, true);
    document.removeEventListener('keyup', this.handleClickOptionUp, true);
  }
  componentDidMount() {
    window.addEventListener('resize', this.handleResize, true);
    document.addEventListener('keydown', this.handleClickOption, true);
    document.addEventListener('keyup', this.handleClickOptionUp, true);
  }
  handleClickOption(e) {
    const key = e.keyCode || e.which || e.charCode;
    if (e.key === 'Alt' || key === 18) {
      this.setState({ optionDown: true });
    }
  }
  handleClickOptionUp(e) {
    const key = e.keyCode || e.which || e.charCode;
    if (e.key === 'Alt' || key === 18) {
      this.setState({ optionDown: false });
    }
  }
  handleResize() {
    if (this.navContent) {
      this.resizeContent(this.navContent);
    }
  }
  resizeContent(node) {
    if (!node) return;
    this.navContent = node;
    let width = document.body.clientWidth;
    width -= 100;
    if (width > 1024) width = 1024;
    if (width < 660) width = 660;
    const subWidth = width / 6;
    let paddingHorizontal = (subWidth - 90) / 2;
    if (paddingHorizontal < 20) paddingHorizontal = 20;
    node.style.maxHeight = '504px';
    node.style.width = `${width}px`;
    const child = node.children;
    for (let i = 0; i < child.length; i += 1) {
      if (child[i]) {
        child[i].style.width = `${subWidth}px`;
        child[i].style.paddingLeft = `${paddingHorizontal}px`;
        child[i].style.paddingRight = `${paddingHorizontal}px`;
        const img = child[i].getElementsByTagName('img');
        if (img && img.length > 0) {
          const imgWidth = subWidth - (paddingHorizontal * 2);
          img[0].style.width = `${imgWidth}px`;
          img[0].style.height = `${imgWidth}px`;
        }
      }
    }
  }
  onClickAdd(item) {
    const { navContent } = this.state;
    const { storage, dbs } = this.props;
    const itemfilter = navContent.filter(editItem => editItem.value === item.value);
    if (itemfilter.length > 0) return;

    navContent.push(item);
    dbs.nav = navContent;
    storage.set({ dbs });
    this.setState({ navContent });
  }
  onShowEdit = () => {
    this.edit.onShowEdit();
  }
  onKeyDownOption(item) {
    const { storage, dbs } = this.props;
    const { navContent } = this.state;
    const itemfilter = navContent.filter(editItem => editItem.value !== item.value);
    dbs.nav = itemfilter;
    storage.set({ dbs });
    this.setState({ navContent: itemfilter });
  }
  render() {
    const { navContent, optionDown } = this.state;
    return (
      <div className={styles.nav}>
        <div className={styles.navBox}>
          <div className={styles.navContent} ref={this.resizeContent.bind(this)}>
            {navContent.map((item, idx) => {
              return (
                <a key={idx} href={item.value} target="_top">
                  <img alt={item.label} src={item.icon} />
                  <p>{item.label}</p>
                  {optionDown && <i onClick={this.onKeyDownOption.bind(this, item)} className={styles.keyDown} />}
                </a>
              );
            })}
            {navContent.length < 18 && (
              <a className={styles.addIcon} onClick={this.onShowEdit.bind(this)}>
                <img alt="" src={addIcon} />
              </a>
            )}
          </div>
        </div>
        <Edit ref={comp => this.edit = comp } onClickAdd={this.onClickAdd.bind(this)} />
      </div>
    );
  }
}