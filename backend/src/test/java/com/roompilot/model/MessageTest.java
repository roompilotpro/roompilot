package com.roompilot.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class MessageTest {

    @Test
    void testMessageCreationWithContent() {
        // Arrange & Act
        String content = "Hello, World!";
        Message message = new Message(content);

        // Assert
        assertNotNull(message);
        assertEquals(content, message.getContent());
        assertNull(message.getId()); // ID is null until saved
    }

    @Test
    void testMessageDefaultConstructor() {
        // Arrange & Act
        Message message = new Message();

        // Assert
        assertNotNull(message);
        assertNull(message.getContent());
        assertNull(message.getId());
    }

    @Test
    void testMessageSettersAndGetters() {
        // Arrange
        Message message = new Message();
        String content = "Test message";
        Long id = 1L;

        // Act
        message.setContent(content);
        message.setId(id);

        // Assert
        assertEquals(content, message.getContent());
        assertEquals(id, message.getId());
    }

    @Test
    void testMessageContentCanBeUpdated() {
        // Arrange
        Message message = new Message("Original content");

        // Act
        message.setContent("Updated content");

        // Assert
        assertEquals("Updated content", message.getContent());
    }
}
