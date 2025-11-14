package com.roompilot.service;

import com.roompilot.model.Message;
import com.roompilot.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MessageService {
    
    @Autowired
    private MessageRepository messageRepository;
    
    public List<Message> getAllMessages() {
        return messageRepository.findAllByOrderByCreatedAtDesc();
    }
    
    public Optional<Message> getMessageById(Long id) {
        return messageRepository.findById(id);
    }
    
    public Message createMessage(String content) {
        Message message = new Message(content);
        return messageRepository.save(message);
    }
    
    public Message updateMessage(Long id, String content) {
        Message message = messageRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Message not found with id: " + id));
        message.setContent(content);
        return messageRepository.save(message);
    }
    
    public void deleteMessage(Long id) {
        messageRepository.deleteById(id);
    }
}