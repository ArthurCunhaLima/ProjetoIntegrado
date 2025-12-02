package com.projeto.projeto.repository;

import com.projeto.projeto.model.Cardapio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CardapioRepository extends JpaRepository<Cardapio, Long> {
    Optional<Cardapio> findByNomeEstabelecimento(String nomeEstabelecimento);
}