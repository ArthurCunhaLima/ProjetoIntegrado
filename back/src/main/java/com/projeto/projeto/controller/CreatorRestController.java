    package com.projeto.projeto.controller;


    import com.projeto.projeto.dto.CardapioResponseDTO;
    import com.projeto.projeto.model.Cardapio;
    import com.projeto.projeto.model.Item;
    import com.projeto.projeto.service.CardapioService;
    import com.projeto.projeto.service.ItemService;
    import jakarta.servlet.http.HttpServletRequest;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;

    @RestController

    @CrossOrigin(origins = "*")
    @RequestMapping("/creator")
    public class CreatorRestController {
        private final ItemService itemService;
        private final CardapioService cardapioService;

        public CreatorRestController(ItemService itemService, CardapioService cardapioService){
            this.itemService = itemService;
            this.cardapioService = cardapioService;
        }
        @PostMapping("/gerarCardapio")
        public ResponseEntity<?> criarCardapio(@RequestBody Cardapio cardapio, HttpServletRequest request) {
            try {
                CardapioResponseDTO response = cardapioService.criarCardapio(cardapio, request);
                return ResponseEntity.ok(response);
            } catch (Exception e) {
                return ResponseEntity.status(500).body("Erro ao gerar cardápio: " + e.getMessage());
            }
        }

        @PutMapping("/atualizarCardapio")
        public ResponseEntity<?> atualizarCardapio(@RequestBody Cardapio cardapio) {
            try {
                Cardapio cardapioAtualizado = cardapioService.atualizarCardapio(cardapio);
                return ResponseEntity.ok(cardapioAtualizado);
            } catch (Exception e) {
                return ResponseEntity.status(500).body("Erro ao atualizar cardápio: " + e.getMessage());
            }
        }
        @DeleteMapping("/item/remover/{nome}")
        public ResponseEntity<?> removerItem(@PathVariable String nome) {
            Item removido = itemService.removerItem(nome);

            if (removido == null) {
                return ResponseEntity.status(404).body("Item não encontrado");
            }

            return ResponseEntity.ok("Item removido com sucesso");
        }



    }
