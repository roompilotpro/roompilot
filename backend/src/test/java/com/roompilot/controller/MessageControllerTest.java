package com.roompilot.controller;

import com.roompilot.model.Message;
import com.roompilot.service.MessageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MessageControllerTest {

    @Mock
    private MessageService messageService;

    @InjectMocks
    private MessageController messageController;

    private Message testMessage;

    @BeforeEach
    void setUp() {
        testMessage = new Message("Test message");
        testMessage.setId(1L);
    }

    @Test
    void testGetAllMessages() {
        // Arrange
        List<Message> messages = Arrays.asList(testMessage, new Message("Another message"));
        when(messageService.getAllMessages()).thenReturn(messages);

        // Act
        List<Message> result = messageController.getAllMessages();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(messageService, times(1)).getAllMessages();
    }

    @Test
    void testGetMessageById_Found() {
        // Arrange
        when(messageService.getMessageById(1L)).thenReturn(Optional.of(testMessage));

        // Act
        ResponseEntity<Message> response = messageController.getMessageById(1L);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Test message", response.getBody().getContent());
        verify(messageService, times(1)).getMessageById(1L);
    }

    @Test
    void testGetMessageById_NotFound() {
        // Arrange
        when(messageService.getMessageById(999L)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<Message> response = messageController.getMessageById(999L);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNull(response.getBody());
        verify(messageService, times(1)).getMessageById(999L);
    }

    @Test
    void testCreateMessage() {
        // Arrange
        Map<String, String> request = new HashMap<>();
        request.put("content", "New message");
        Message newMessage = new Message("New message");
        when(messageService.createMessage("New message")).thenReturn(newMessage);

        // Act
        Message result = messageController.createMessage(request);

        // Assert
        assertNotNull(result);
        assertEquals("New message", result.getContent());
        verify(messageService, times(1)).createMessage("New message");
    }

    @Test
    void testUpdateMessage_Success() {
        // Arrange
        Map<String, String> request = new HashMap<>();
        request.put("content", "Updated content");
        testMessage.setContent("Updated content");
        when(messageService.updateMessage(eq(1L), eq("Updated content"))).thenReturn(testMessage);

        // Act
        ResponseEntity<Message> response = messageController.updateMessage(1L, request);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Updated content", response.getBody().getContent());
        verify(messageService, times(1)).updateMessage(1L, "Updated content");
    }

    @Test
    void testUpdateMessage_NotFound() {
        // Arrange
        Map<String, String> request = new HashMap<>();
        request.put("content", "Updated content");
        when(messageService.updateMessage(eq(999L), any())).thenThrow(new RuntimeException("Not found"));

        // Act
        ResponseEntity<Message> response = messageController.updateMessage(999L, request);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNull(response.getBody());
        verify(messageService, times(1)).updateMessage(eq(999L), any());
    }

    @Test
    void testDeleteMessage() {
        // Arrange
        doNothing().when(messageService).deleteMessage(1L);

        // Act
        ResponseEntity<Void> response = messageController.deleteMessage(1L);

        // Assert
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        assertNull(response.getBody());
        verify(messageService, times(1)).deleteMessage(1L);
    }
}
