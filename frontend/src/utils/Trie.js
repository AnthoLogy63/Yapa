class TrieNode {
    constructor() {
        this.children = {};
        this.suggestion = null; // Stores the preferred suggestion for this prefix
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    /**
     * Inserts a word into the Trie.
     * Assumes words are inserted in order of priority (e.g., oldest first).
     * @param {string} word 
     */
    insert(word) {
        let node = this.root;
        const lowerWord = word.toLowerCase();

        for (let i = 0; i < lowerWord.length; i++) {
            const char = lowerWord[i];
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];

            // If this node doesn't have a suggestion yet, set it.
            // Since we insert oldest first, the first one we see is the correct one.
            if (!node.suggestion) {
                node.suggestion = word;
            }
        }
    }

    /**
     * Searches for the preferred suggestion for a given prefix.
     * @param {string} prefix 
     * @returns {string|null} The suggestion or null if not found.
     */
    search(prefix) {
        let node = this.root;
        const lowerPrefix = prefix.toLowerCase();

        for (let i = 0; i < lowerPrefix.length; i++) {
            const char = lowerPrefix[i];
            if (!node.children[char]) {
                return null;
            }
            node = node.children[char];
        }

        return node.suggestion;
    }
}

export default Trie;
