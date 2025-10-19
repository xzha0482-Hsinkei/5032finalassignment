<template>
  <div class="chatbot-container">
    <div class="chat-header" @click="toggleChat">
      <span>🤖 AI Assistant</span>
      <span>{{ isOpen ? '−' : '+' }}</span>
    </div>

    <div v-if="isOpen" class="chat-body">
      <div class="messages">
        <div
          v-for="(msg, i) in messages"
          :key="i"
          :class="['message', msg.role]"
        >
          <strong v-if="msg.role === 'user'">You:</strong>
          <strong v-else>AI:</strong>
          <p>{{ msg.content }}</p>
        </div>
      </div>

      <div class="input-area">
        <input
          v-model="input"
          @keyup.enter="sendMessage"
          placeholder="Ask something..."
          :disabled="loading"
        />
        <button @click="sendMessage" :disabled="loading || !input.trim()">
          {{ loading ? '...' : 'Send' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 聊天状态
const messages = ref([])
const input = ref('')
const loading = ref(false)
const isOpen = ref(false)

function toggleChat() {
  isOpen.value = !isOpen.value
}

async function sendMessage() {
  if (!input.value.trim()) return

  const question = input.value
  messages.value.push({ role: 'user', content: question })
  input.value = ''
  loading.value = true

  // 临时添加一个“thinking...”提示
  messages.value.push({ role: 'ai', content: 'Thinking...' })

  try {
    const res = await fetch('https://us-central1-finalassignment-a39fa.cloudfunctions.net/aiSuggest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: question }),
    })

    const data = await res.json()
    console.log('🔥 AI raw response:', data)

    // 兼容多种后端返回格式
    const reply =
      data?.choices?.[0]?.message?.content ||
      data?.choices?.[0]?.text ||
      data?.result ||
      data?.reply ||
      data?.message ||
      data?.response ||
      '⚠️ No valid response from AI.'

    // 替换最后一条“Thinking...”为真实回复
    messages.value[messages.value.length - 1] = { role: 'ai', content: reply }
  } catch (err) {
    messages.value[messages.value.length - 1] = {
      role: 'ai',
      content: '⚠️ Error: ' + err.message,
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.chatbot-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 320px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  background: #fff;
  font-family: system-ui, sans-serif;
  z-index: 1000;
}
.chat-header {
  background: #3b82f6;
  color: white;
  padding: 10px 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.chat-body {
  display: flex;
  flex-direction: column;
  height: 380px;
}
.messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background: #f9fafb;
}
.message {
  margin-bottom: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  line-height: 1.4;
  word-wrap: break-word;
  white-space: pre-wrap;
}
.message.user {
  background: #dbeafe;
  align-self: flex-end;
  text-align: right;
}
.message.ai {
  background: #f3f4f6;
  align-self: flex-start;
  text-align: left;
}
.input-area {
  display: flex;
  border-top: 1px solid #e5e7eb;
}
.input-area input {
  flex: 1;
  border: none;
  padding: 10px;
  outline: none;
  font-size: 14px;
}
.input-area button {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0 14px;
  cursor: pointer;
  transition: background 0.2s;
}
.input-area button:hover:not(:disabled) {
  background: #2563eb;
}
.input-area button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
