import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import axios from 'axios';

export default function ChatScreen() {
  const [messages, setMessages] = useState<{ id: string, text: string, fromUser: boolean }[]>([]);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now().toString(), text: input, fromUser: true };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    scrollToBottom();

    try {
      const res = await axios.post('[ngrok http 5000]/chat', { message: input });
      const botMsg = { id: Date.now().toString(), text: res.data.reply, fromUser: false };
      setMessages(prev => [...prev, botMsg]);
      scrollToBottom();
    } catch (e) {
      const errMsg = { id: Date.now().toString(), text: 'Error contacting server', fromUser: false };
      setMessages(prev => [...prev, errMsg]);
      scrollToBottom();
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={[styles.msg, item.fromUser ? styles.user : styles.bot]}>
                <Text>{item.text}</Text>
              </View>
            )}
          />
          <View style={styles.inputBar}>
            <TextInput
              style={styles.input}
              placeholder="Type your message..."
              value={input}
              onChangeText={setInput}
              onSubmitEditing={sendMessage}
              returnKeyType="send"
            />
            <Button title="Send" onPress={sendMessage} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  msg: { padding: 10, marginVertical: 5, borderRadius: 5, maxWidth: '80%' },
  user: { alignSelf: 'flex-end', backgroundColor: '#DCF8C6' },
  bot: { alignSelf: 'flex-start', backgroundColor: '#EEE' },
  inputBar: { flexDirection: 'row', alignItems: 'center', paddingTop: 10 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 5,
    backgroundColor: '#fff'
  }
});