package com.roompilot.service;

import com.roompilot.model.Message;
import com.roompilot.repository.MessageRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MessageServiceTest {

    @Mock
    private MessageRepository messageRepository;

    @InjectMocks
    private MessageService messageService;

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
        when(messageRepository.findAllByOrderByCreatedAtDesc()).thenReturn(messages);

        // Act
        List<Message> result = messageService.getAllMessages();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(messageRepository, times(1)).findAllByOrderByCreatedAtDesc();
    }

    @Test
    void testGetMessageById_Found() {
        // Arrange
        when(messageRepository.findById(1L)).thenReturn(Optional.of(testMessage));

        // Act
        Optional<Message> result = messageService.getMessageById(1L);

        // Assert
        assertTrue(result.isPresent());
        assertEquals("Test message", result.get().getContent());
        verify(messageRepository, times(1)).findById(1L);
    }

    @Test
    void testGetMessageById_NotFound() {
        // Arrange
        when(messageRepository.findById(999L)).thenReturn(Optional.empty());

        // Act
        Optional<Message> result = messageService.getMessageById(999L);

        // Assert
        assertFalse(result.isPresent());
        verify(messageRepository, times(1)).findById(999L);
    }

    @Test
    void testCreateMessage() {
        // Arrange
        String content = "New message";
        Message newMessage = new Message(content);
        when(messageRepository.save(any(Message.class))).thenReturn(newMessage);

        // Act
        Message result = messageService.createMessage(content);

        // Assert
        assertNotNull(result);
        assertEquals(content, result.getContent());
        verify(messageRepository, times(1)).save(any(Message.class));
    }

    @Test
    void testUpdateMessage_Success() {
        // Arrange
        String updatedContent = "Updated content";
        when(messageRepository.findById(1L)).thenReturn(Optional.of(testMessage));
        when(messageRepository.save(any(Message.class))).thenReturn(testMessage);

        // Act
        Message result = messageService.updateMessage(1L, updatedContent);

        // Assert
        assertNotNull(result);
        assertEquals(updatedContent, result.getContent());
        verify(messageRepository, times(1)).findById(1L);
        verify(messageRepository, times(1)).save(testMessage);
    }

    @Test
    void testUpdateMessage_NotFound() {
        // Arrange
        when(messageRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            messageService.updateMessage(999L, "Updated content");
        });
        verify(messageRepository, times(1)).findById(999L);
        verify(messageRepository, never()).save(any(Message.class));
    }

    @Test
    void testDeleteMessage() {
        // Arrange
        doNothing().when(messageRepository).deleteById(1L);

        // Act
        messageService.deleteMessage(1L);

        // Assert
        verify(messageRepository, times(1)).deleteById(1L);
    }
}
