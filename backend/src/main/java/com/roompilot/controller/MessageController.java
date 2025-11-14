package com.roompilot.controller;

import com.roompilot.model.Message;
import com.roompilot.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "https://*.vercel.app"})
public class MessageController {
    
    @Autowired
    private MessageService messageService;
    
    @GetMapping
    public List<Message> getAllMessages() {
        return messageService.getAllMessages();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Message> getMessageById(@PathVariable Long id) {
        return messageService.getMessageById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public Message createMessage(@RequestBody Map<String, String> request) {
        String content = request.get("content");
        return messageService.createMessage(content);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Message> updateMessage(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String content = request.get("content");
            Message updatedMessage = messageService.updateMessage(id, content);
            return ResponseEntity.ok(updatedMessage);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long id) {
        messageService.deleteMessage(id);
        return ResponseEntity.noContent().build();
    }
}