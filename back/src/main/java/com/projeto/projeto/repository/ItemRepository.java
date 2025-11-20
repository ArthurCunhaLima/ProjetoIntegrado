package com.projeto.projeto.repository;


import com.projeto.projeto.model.Cardapio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.projeto.projeto.model.Item;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    Item findByNome(String nome);
    void deleteByNome(String nome);
}
