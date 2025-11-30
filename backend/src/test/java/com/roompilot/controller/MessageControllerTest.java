package com.roompilot.controller;

import static com.roompilot.fixtures.TestConstants.TestData.ANOTHER_MESSAGE_CONTENT;
import static com.roompilot.fixtures.TestConstants.TestData.NEW_MESSAGE_CONTENT;
import static com.roompilot.fixtures.TestConstants.TestData.NONEXISTENT_MESSAGE_ID;
import static com.roompilot.fixtures.TestConstants.TestData.TEST_MESSAGE_CONTENT;
import static com.roompilot.fixtures.TestConstants.TestData.TEST_MESSAGE_ID;
import static com.roompilot.fixtures.TestConstants.TestData.UPDATED_MESSAGE_CONTENT;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.roompilot.model.Message;
import com.roompilot.service.MessageService;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@ExtendWith(MockitoExtension.class)
class MessageControllerTest {

  @Mock private MessageService messageService;

  @InjectMocks private MessageController messageController;

  private Message testMessage;

  @BeforeEach
  void setUp() {
    testMessage = new Message(TEST_MESSAGE_CONTENT);
    testMessage.setId(TEST_MESSAGE_ID);
  }

  @Test
  void testGetAllMessages() {
    // Arrange
    List<Message> messages = Arrays.asList(testMessage, new Message(ANOTHER_MESSAGE_CONTENT));
    when(messageService.getAllMessages()).thenReturn(messages);

    // Act
    List<Message> result = messageController.getAllMessages();

    // Assert
    assertNotNull(result);
    assertEquals(2, result.size());
    verify(messageService, times(1)).getAllMessages();
  }

  @Test
  void testGetMessageByIdFound() {
    when(messageService.getMessageById(TEST_MESSAGE_ID)).thenReturn(Optional.of(testMessage));

    ResponseEntity<Message> response = messageController.getMessageById(TEST_MESSAGE_ID);

    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals(TEST_MESSAGE_CONTENT, response.getBody().getContent());
    verify(messageService, times(1)).getMessageById(TEST_MESSAGE_ID);
  }

  @Test
  void testGetMessageByIdNotFound() {
    when(messageService.getMessageById(NONEXISTENT_MESSAGE_ID)).thenReturn(Optional.empty());

    ResponseEntity<Message> response = messageController.getMessageById(NONEXISTENT_MESSAGE_ID);

    assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    assertNull(response.getBody());
    verify(messageService, times(1)).getMessageById(NONEXISTENT_MESSAGE_ID);
  }

  @Test
  void testCreateMessage() {
    // Arrange
    Map<String, String> request = new HashMap<>();
    request.put("content", NEW_MESSAGE_CONTENT);
    Message newMessage = new Message(NEW_MESSAGE_CONTENT);
    when(messageService.createMessage(NEW_MESSAGE_CONTENT)).thenReturn(newMessage);

    // Act
    Message result = messageController.createMessage(request);

    // Assert
    assertNotNull(result);
    assertEquals(NEW_MESSAGE_CONTENT, result.getContent());
    verify(messageService, times(1)).createMessage(NEW_MESSAGE_CONTENT);
  }

  @Test
  void testUpdateMessageSuccess() {
    Map<String, String> request = new HashMap<>();
    request.put("content", UPDATED_MESSAGE_CONTENT);
    testMessage.setContent(UPDATED_MESSAGE_CONTENT);
    when(messageService.updateMessage(eq(TEST_MESSAGE_ID), eq(UPDATED_MESSAGE_CONTENT)))
        .thenReturn(testMessage);

    ResponseEntity<Message> response = messageController.updateMessage(TEST_MESSAGE_ID, request);

    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals(UPDATED_MESSAGE_CONTENT, response.getBody().getContent());
    verify(messageService, times(1)).updateMessage(TEST_MESSAGE_ID, UPDATED_MESSAGE_CONTENT);
  }

  @Test
  void testUpdateMessageNotFound() {
    Map<String, String> request = new HashMap<>();
    request.put("content", UPDATED_MESSAGE_CONTENT);
    when(messageService.updateMessage(eq(NONEXISTENT_MESSAGE_ID), any()))
        .thenThrow(new RuntimeException("Not found"));

    ResponseEntity<Message> response =
        messageController.updateMessage(NONEXISTENT_MESSAGE_ID, request);

    assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    assertNull(response.getBody());
    verify(messageService, times(1)).updateMessage(eq(NONEXISTENT_MESSAGE_ID), any());
  }

  @Test
  void testDeleteMessage() {
    // Arrange
    doNothing().when(messageService).deleteMessage(TEST_MESSAGE_ID);

    // Act
    ResponseEntity<Void> response = messageController.deleteMessage(TEST_MESSAGE_ID);

    // Assert
    assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
    assertNull(response.getBody());
    verify(messageService, times(1)).deleteMessage(TEST_MESSAGE_ID);
  }
}
