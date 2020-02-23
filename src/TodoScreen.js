import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  StatusBar, 
  Platform, 
  ScrollView,
  FlatList,
  //TextInput,
  //Button,
  KeyboardAvoidingView,
  AsyncStorage,
  TouchableOpacity
 } from 'react-native';
import { render } from 'react-dom'
import { 
  SearchBar, 
  Input, 
  Button,
  ListItem,
} from 'react-native-elements'

import Icon from 'react-native-vector-icons/Feather'

import Icon2 from 'react-native-vector-icons/MaterialIcons'

import { ifIphoneX, getStatusBarHeight } from 'react-native-iphone-x-helper'

import { connect } from 'react-redux'
import { addTodo, toggleTodo } from './actionCreators'

// 高さを判断して値を設定
const STATUSBAR_HEIGHT = getStatusBarHeight();

const TODO = "@todoapp.todo"

// Functional Component タグを追加する
const TodoItem = (props) => {
  let icon = null
  if(props.done === true) {
    icon = <Icon2 name="done"/>
  }
  return (
    <TouchableOpacity onPress={props.onTapTodoItem}>
      <ListItem
        title={props.title}
        rightIcon={icon}
        bottomDivider
      />
    </TouchableOpacity>
  )
}

class TodoScreen extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      inputText: "",
      filterText: "",
    }
  }


  onAddItem = () => {
    const title = this.state.inputText
    if(title == "") {
      return
    }
    this.props.addTodo(title)
    this.setState({
      inputText: ""
    })
  }

  onTapTodoItem = (todoItem) => {
    this.props.toggleTodo(todoItem)
  }

  render() {
    // filtetr処理
    const filterText = this.state.filterText
    let todo = this.props.todos
    if(filterText !== "") {
      todo = todo.filter(t => t.title.includes(filterText))
    }
    const platform = Platform.OS == 'ios' ? 'ios' : 'android'
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        {/* フィルタの部分 */}
        <SearchBar
          platform={platform}
          cancelButtonTitle='Cancel'
          onChangeText={(text) => this.setState({filterText: text})}
          onClear={() => this.setState({filterText: ""})}
          value={this.state.filterText}
          placeholder="Type filter text"
        />

        {/* TODOリスト */}
        <ScrollView style={styles.todolist}>
          <FlatList data={todo} 
            extraData={this.state}
            renderItem={({item}) => 
              <TodoItem
                title={item.title}
                done={item.done}
                onTapTodoItem={() => this.onTapTodoItem(item)}
              />
            }
            keyExtractor={(item, index) => "todo_" + item.index}
          />
        </ScrollView>
        {/* 入力スペース */}
        <View style={styles.input}>
          <Input
            onChangeText={(text) => this.setState({inputText: text})}
            value={this.state.inputText}
            containerStyle={this.state.inputText}
          />
          <Button
            icon={
              <Icon
                name='plus'
                size={30}
                color='white'
              />
            }
            title=""
            onPress={this.onAddItem}
            buttonStyle={styles.inputButton}
          />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = state => {
  return {
    todos: state.todos.todos,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addTodo(text) {
      dispatch(addTodo(text))
    },
    toggleTodo(todo) {
      dispatch(toggleTodo(todo))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: STATUSBAR_HEIGHT,
  },
  filter: {
    height: 30,
  },
  todolist: {
    flex: 1,
  },
  input: {
    ...ifIphoneX({
      paddingBottom: 30,
      height: 80
    }, {
      height: 50,
    }),
    flexDirection: 'row',
    paddingRight: 50,
  },
  inputText: {
    paddingLeft: 10,
    paddingRight: 10,
    flex: 1,
  },
  inputButton: {
    width: 48,
    height: 48,
    borderWidth: 0,
    borderColor: 'transparent',
    borderRadius: 48,
    backgroundColor: '#ff6347',
  },
  todoItem: {
    fontSize: 20,
    backgroundColor: "white",
  },
  todoItemDone: {
    fontSize: 20,
    backgroundColor: "red",
  },
});